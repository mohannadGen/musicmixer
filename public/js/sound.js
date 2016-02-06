var context;
var source = null;
var audioBuffer = null;
// Les echantillons prêts à être joués, de toutes les pistes
var tracks = [];
var buffers = []; // audio buffers decoded
var samples = []; // audiograph nodes

var analysers = [];

// Master volume
var masterVolumeNode;
var trackVolumeNodes = [];

//Pour pouvoir sauvegarder le mute
mute = [];

//Pour sauvegarder la reverb
reverbe = 0;

var distortionNodes = [];
var distortionNodesB = [];

var buttonPlay, buttonStop, buttonPause;
var masterVolumeSlider;
// List of tracks and mute buttons
var divTrack;

var canvas, ctx;
var frontCanvas, frontCtx;

// Sample size in pixels
var SAMPLE_HEIGHT = 100;

// Useful for memorizing when we paused the song
var lastTime = 0;
var currentTime;
var delta;

var elapsedTimeSinceStart = 0;

var paused = false;

var actualyPlaying = false;

var WIDTH = 500;
var HEIGHT = 200;

var debugSineWave = 0;


// EQ Properties => EGALISEUR
//

var gainDb = -40.0;
var bandSplit = [360,3600];

var hGain = [];
var mGain = [];
var lGain = [];
var hBand = [];
var lBand = [];

hGainSave = [];
mGainSave = [];
lGainSave = [];

//tab mono/stereo
buttonMonoStereo = [];

//Pour la mono / stereo
splitters = [];
mergers = [];
gainMS = [];

//Puis ses couleurs

var	hotChroma = new chroma.ColorScale({
        colors:['#000000','#ff0000','ffff00','#ffffff'],
        positions:[0,0.25,0.75,1],
        mode:'rgb',
        limits:[0,300]
});

// requestAnim shim layer by Paul Irish, like that canvas animation works
// in all browsers
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function init() {
	// Object that draws a sample waveform in a canvas
	waveformDrawer = new WaveformDrawer();

    // Get handles on buttons
    buttonPlay = document.querySelector("#bplay");
    buttonPause = document.querySelector("#bpause");
    buttonStop = document.querySelector("#bstop");

	buttonSave = document.querySelector("#buttonSave");

    divTrack = document.getElementById("tracks");

    // canvas where we draw the samples
    canvas = document.querySelector("#myCanvas");
    ctx = canvas.getContext('2d');

    // Create a second canvas
    frontCanvas = document.createElement('canvas');
    frontCanvas.id = 'canvasFront';
    // Add it as a second child of the mainCanvas parent.
    canvas.parentNode.appendChild(frontCanvas);
    // make it same size as its brother
    frontCanvas.height = canvas.height;
    frontCanvas.width = canvas.width;
    frontCtx = frontCanvas.getContext('2d');

    frontCanvas.addEventListener("mousedown", function(event) {
        console.log("mouse click on canvas, let's jump to another position in the song");
        var mousePos = getMousePos(frontCanvas, event);
        // will compute time from mouse pos and start playing from there...
        jumpTo(mousePos);
    });

    // Master volume slider
    masterVolumeSlider = document.querySelector("#masterVolume");

    // Init audio context
    context = initAudioContext();

	// Create a filter
	filter = context.createBiquadFilter();

    // Get the list of the songs available on the server and build a
    // drop down menu
    //loadSongList();
    //var tracks = document.getElementById("hidden").value;
    loadTrackList(songtracks);

    animateTime();
}

function initAudioContext() {
    // Initialise the Audio Context
    // There can be only one!
    var audioContext = window.AudioContext || window.webkitAudioContext;

    var ctx = new audioContext();

	//alert(ctx);
	analyser = ctx.createAnalyser();
	javascriptNode = ctx.createScriptProcessor(2048, 1, 1);
	//distortion = ctx.createWaveShaper();
    if(ctx === undefined) {
        throw new Error('AudioContext is not supported. :(');
    }
    return ctx;
}

function resetAllBeforeLoadingANewSong() {
    // Marche pas, c'est pour tester...
    console.log('resetAllBeforeLoadingANewSong');
    // reset array of tracks. If we don't do this we just add new samples to existing
    // ones... playing two songs at the same time etc.
    tracks = [];

    stopAllTracks();
    buttonPlay.disabled = true;
    //divTrack.innerHTML="";
    /*
    samples.forEach(function(s) {
        s.stop(0);
        s.disconnect(0);
    });*/
}

var bufferLoader;

function loadAllSoundSamples(tracks) {
    bufferLoader = new BufferLoader(
            context,
            tracks,
            finishedLoading
            );
    bufferLoader.load();
}

function finishedLoading(bufferList) {
    console.log("finished loading");

    buffers = bufferList;
    buttonPlay.disabled = false;

	buttonSave.disabled = false;
}

function buildGraph(bufferList) {
    sources = [];
    // Create a single gain node for master volume
    masterVolumeNode = context.createGain();
    console.log("in build graph, bufferList.size = " + bufferList.length);

    bufferList.forEach(function(sample, i) {

		//MONO STEREO
		splitters[i] = context.createChannelSplitter(2);
		mergers[i] = context.createChannelMerger(2);
		gainMS[i] = context.createGain();

		//On cree les boutons mono / stereo pour chaque piste
		buttonMonoStereo[i] = document.querySelector("#buttonMonoStereo"+i);

		//On ajoute un compresseur
		// Create a compressor node
		compressor = context.createDynamicsCompressor();
		compressor.threshold.value = -24;
		compressor.knee.value = 30;
		compressor.ratio.value = 12;
		compressor.reduction.value = -20;
		compressor.attack.value = 0.003;
		compressor.release.value = 0.25;

		//init context pour la distortion
		distortionNodes[i] = context.createWaveShaper();
		distortionNodesB[i] = false;

		// each sound sample is the  source of a graph
        sources[i] = context.createBufferSource();
        sources[i].buffer = sample;

		/** PARAM EGALISEUR **/

		hBand[i] = context.createBiquadFilter();
		hBand[i].type = "lowshelf";
		hBand[i].frequency.value = bandSplit[0];
		hBand[i].gain.value = gainDb;

		lBand[i] = context.createBiquadFilter();
		lBand[i].type = "highshelf";
		lBand[i].frequency.value = bandSplit[1];
		lBand[i].gain.value = gainDb;

		sources[i].connect(lBand[i]);
		sources[i].connect(hBand[i]);

		lGain[i] = context.createGain();
		mGain[i] = context.createGain();
		hGain[i] = context.createGain();

		lBand[i].connect(lGain[i]);
		sources[i].connect(mGain[i]);
		hBand[i].connect(hGain[i]);

        // connect each sound sample to a vomume node
        trackVolumeNodes[i] = context.createGain();

		// Connect the sound sample to its volume node

		lGain[i].connect(trackVolumeNodes[i]);
		mGain[i].connect(trackVolumeNodes[i]);
		hGain[i].connect(trackVolumeNodes[i]);

		/**
		lBand[i].connect(trackVolumeNodes[i]);
		mBand[i].connect(trackVolumeNodes[i]);
		hBand[i].connect(trackVolumeNodes[i]);
		**/


		//alert(trackVolumeNodes[i].channelCount);
        // Connects all track volume nodes a single master volume node

		//trackVolumeNodes[i].connect(distortionNodes[i]);

		trackVolumeNodes[i].connect(splitters[i]);

		gainMS[i].value = 0.5;
		splitters[i].connect(gainMS[i],0);

		gainMS[i].connect(mergers[i], 0, 1);
		splitters[i].connect(mergers[i], 1, 0);

		mergers[i].connect(distortionNodes[i]);

		//alert(mergers[i].channelCount);

		distortionNodes[i].connect(masterVolumeNode);

		masterVolumeNode.connect(compressor);
		compressor.connect(filter);

		// Note: the Web Audio spec is moving from constants to strings.
		filter.type = filter.LOWPASS;
		filter.frequency.value = 1000;

		// Connect the master volume to the speakers
		filter.connect(context.destination);
		filter.connect(analyser);

		analyser.connect(javascriptNode);
		javascriptNode.connect(context.destination);

		//Parce que c'est mieux ;)
		analyser.fftSize = 2048;

        // On active les boutons start et stop
        samples = sources;
    });
	//alert(ctx);
	//alert(context);
}

// ######### SONGS
function loadSongList() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "track", true);

    // Menu for song selection
    var s = $("<select/>");
    s.appendTo("#songs");
    s.change(function(e) {
        console.log("You chose : " + $(this).val());
        loadTrackList($(this).val());
    });

    xhr.onload = function(e) {
        var songList = JSON.parse(this.response);

        songList.forEach(function(songName) {
            console.log(songName);

            $("<option />", {value: songName, text: songName}).appendTo(s);

            /*
            var list = document.getElementById("songs");
            var li = document.createElement('li');
            li.textContent = songName;
            button = document.createElement('button');
            button.setAttribute("onclick", "loadTrackList('" + songName + "');");
            button.textContent = "load";
            li.appendChild(button);
            list.appendChild(li);
            */
        });
    };
    xhr.send();
}

// ######## TRACKS
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function getTrackName(elem) {
// returns the name without the suffix
    var n = elem.lastIndexOf(".");
    return elem.slice(0, n + 1);
}

function loadTrackList(songName) {
   // var tracks = session.getAttribrute("tracks");
    //var tracks = document.getElementById("hidden").value;
    //var songtracks = document.cookie("songtracks");
    console.log("Song Tracks: ");
    console.log(songtracks);
    resetAllBeforeLoadingANewSong();
    resizeSampleCanvas(songtracks.instruments.length);
    tracks = songtracks.urls;
    loadAllSoundSamples(tracks);
}

function getMousePos(canvas, evt) {
    // get canvas position
    var obj = canvas;
    var top = 0;
    var left = 0;

    while (obj && obj.tagName != 'BODY') {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    // return relative mouse position
    var mouseX = evt.clientX - left + window.pageXOffset;
    var mouseY = evt.clientY - top + window.pageYOffset;
    return {
        x:mouseX,
        y:mouseY
    };
 }

 function jumpTo(mousePos) {
    console.log("in jumpTo x = " + mousePos.x + " y = " + mousePos.y);
    // width - totalTime
    // x - ?
       stopAllTracks();
    totalTime = buffers[0].duration;
    var startTime = (mousePos.x * totalTime) / frontCanvas.width;
	elapsedTimeSinceStart = startTime;

	actualyPlaying = true;
	changePauseImg();

    playAllTracks(startTime);
 }

function animateTime() {
    if (!paused) {
        // Draw the time on the front canvas
        currentTime = context.currentTime;
        var delta = currentTime - lastTime;

		frontCtx2 = frontCanvas.getContext('2d');
		frontCtx2.clearRect(0, 0, canvas.width, canvas.height);
		//frontCtx2.fillStyle = "black";

        var totalTime;

        frontCtx.clearRect(0, 0, canvas.width, canvas.height);
        frontCtx.fillStyle = "rgba(254,105,0,0.6)";
        frontCtx.font = '14pt Arial';
        frontCtx.fillText(elapsedTimeSinceStart.toPrecision(4), 100, 20);
        //console.log("dans animate");

        // at least one track has been loaded
        if (buffers[0] != undefined) {

            var totalTime = buffers[0].duration;
            var x = elapsedTimeSinceStart * canvas.width / totalTime;

            frontCtx.strokeStyle = "white";
            frontCtx.lineWidth = 3;
            frontCtx.beginPath();
            frontCtx.moveTo(x, 0);
            frontCtx.lineTo(x, canvas.height);
            frontCtx.stroke();

			frontCtx2.fillRect(0, 0, x, canvas.height);
			//frontCtx2.fillStyle = "black";
			if(elapsedTimeSinceStart <totalTime){
				elapsedTimeSinceStart += delta;
			}
            lastTime = currentTime;
        }
    }
    requestAnimFrame(animateTime);
}

function drawSampleImage(imageURL, trackNumber, trackName) {
    var image = new Image();

    image.onload = function() {
        // SAMPLE_HEIGHT pixels height
        var x = 0;
        var y = trackNumber * SAMPLE_HEIGHT;
        ctx.drawImage(image, x, y, canvas.width, SAMPLE_HEIGHT);

        ctx.strokeStyle = "white";
        ctx.strokeRect(x, y, canvas.width, SAMPLE_HEIGHT);

        ctx.font = '14pt Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(trackName, x + 10, y + 20);
    };
    image.src = imageURL;
}

function resizeSampleCanvas(numTracks) {
    canvas.height = SAMPLE_HEIGHT * numTracks;
    frontCanvas.height = canvas.height;
}

function clearAllSampleDrawings() {
    //ctx.clearRect(0,0, canvas.width, canvas.height);
}

function loadSong(song) {
    loadTrackList(song);
}

function playAllTracks(startTime) {

	if(paused){
		paused = false;
		actualyPlaying = false;
		// we were in pause, let's start again from where we paused
        playAllTracks(elapsedTimeSinceStart);
        //buttonPause.innerHTML = "Pause";
		for(var j=0; j<nbInstrumentsMusique;j++){
			document.getElementById("buttonDistortion"+j).disabled = false;
		}
		//buttonFilter.disabled = false;

    }else{
		//On ne lance play que si il n'est pas déjà lancé
		if(actualyPlaying == false){
			actualyPlaying = true;
			buildGraph(buffers);

			playFrom(startTime);
		}
	}

}

// Same as previous one except that we not rebuild the graph. Useful for jumping from one
// part of the song to another one, i.e. when we click the mouse on the sample graph
function playFrom(startTime) {
	//On precharge les paramètres car le graphe n'était pas construit si pause ou avant start
	loadParameters();
	samples.forEach(function(s) {
		// First parameter is the delay before playing the sample
		// second one is the offset in the song, in seconds, can be 2.3456
		// very high precision !
        s.start(0, startTime);
    });

	/**
	 *
	 * Auteur: Benjamin
	 * SI ON DETECTE UN SON, ON DESSINE
	 *
	**/
	javascriptNode.onaudioprocess = function () {
		draw(analyser);
	};

    buttonPlay.disabled = true;
    buttonStop.disabled = false;
    buttonPause.disabled = false;
	for(var j=0; j<nbInstrumentsMusique;j++){
			document.getElementById("buttonDistortion"+j).disabled = false;
			buttonMonoStereo[j].disabled = false;
	}
	//buttonFilter.disabled = false;

    // Note : we memorise the current time, context.currentTime always
    // goes forward, it's a high precision timer
    console.log("start all tracks startTime =" + startTime);
    lastTime = context.currentTime;
    paused = false;

}

function stopAllTracks() {
    samples.forEach(function(s) {
		// destroy the nodes
        s.stop(0);
    });

	actualyPlaying = false;

	//masterVolumeNode.disconect(0);
	//distortion.disconnet(0);
	//filter.disconnect(0);
	//analyser.disconnect(0);
	//javascriptNode.disconnect(0);

    buttonStop.disabled = true;
    buttonPause.disabled = true;
    buttonPlay.disabled = false;
	for(var j=0; j<nbInstrumentsMusique;j++){
			document.getElementById("buttonDistortion"+j).disabled = true;
	}
	//buttonFilter.disabled = true;
    elapsedTimeSinceStart = 0;
    paused = true;
}

function pauseAllTracks() {
    if (!paused) {
        // Then stop playing
        samples.forEach(function(s) {
			// destroy the nodes
            s.stop(0);
        });

		actualyPlaying = false;

		//masterVolumeNode.disconect(0);
		//distortion.disconnet(0);
		//filter.disconnect(0);
		//analyser.disconnect(0);
		//javascriptNode.disconnect(0);

        paused = true;
        //buttonPause.innerHTML = "Resume";
		for(var j=0; j<nbInstrumentsMusique;j++){
			document.getElementById("buttonDistortion"+j).disabled = true;
		}
		//buttonFilter.disabled = true;
		buttonPlay.disabled = false;
    } else {
		actualyPlaying = false;
        paused = false;
		// we were in pause, let's start again from where we paused
        playAllTracks(elapsedTimeSinceStart);
        //buttonPause.innerHTML = "Pause";
		for(var j=0; j<nbInstrumentsMusique;j++){
			document.getElementById("buttonDistortion"+j).disabled = false;
		}
		//buttonFilter.disabled = false;
    }
}

function setMasterVolume() {
   var fraction = parseInt(masterVolumeSlider.value) / parseInt(masterVolumeSlider.max);
    // Let's use an x*x curve (x-squared) since simple linear (x) does not
    // sound as good.
    if( masterVolumeNode != undefined){
		if(actualyPlaying == true){
			masterVolumeNode.gain.value = fraction * fraction;
		}
	}
}

function changeMasterVolume() {
   setMasterVolume();
}

function muteUnmuteTrack(trackNumber) {
	// AThe mute / unmute button
	if(trackVolumeNodes[trackNumber]){
		var b = document.querySelector("#mute" + trackNumber);
		if (mute[parseInt(trackNumber)] == 0) {
			if(actualyPlaying == true){
				trackVolumeNodes[trackNumber].gain.value = 0;
			}
			//b.innerHTML = "Unmute";
		} else {
			if(actualyPlaying == true){
				var volumeP = parseFloat(document.getElementById('volume2RangeTest'+trackNumber).value)/120;
				trackVolumeNodes[trackNumber].gain.value = volumeP;
			}
			//b.innerHTML = "Mute";
		}
	}
}
