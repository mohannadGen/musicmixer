/* PARTIE FILTER */

function changeFrequency(freq) {
	//alert(parseInt(freq));
	if(actualyPlaying == true){
		filter.frequency.value = parseInt(freq);
	}
	document.getElementById('valFrequency').innerHTML = "&nbsp;&nbsp;&nbsp;"+freq + " / 3000";
}

function changeQuality(qual) {
	//alert(parseInt(qual));
	if(actualyPlaying == true){
		filter.Q.value = parseInt(qual);
	}
	document.getElementById('valQuality').innerHTML = "&nbsp;&nbsp;&nbsp;"+qual + " / 100";
}

function changeGain1(gainVal) {
	//alert(parseInt(gainVal));
	if(actualyPlaying == true){
		filter.gain.value = parseInt(gainVal);
	}
	document.getElementById('valGain').innerHTML = "&nbsp;&nbsp;&nbsp;"+gainVal + " / 100";
}

function changeEffect(name) {

	//alert(name);
	document.getElementById('gainRangeTest').style.display = 'none';
	document.getElementById('txtGain').style.display = 'none';
	document.getElementById('valGain').style.display = 'none';
	document.getElementById('qualityRangeTest').style.display = 'inherit';
	document.getElementById('txtQuality').style.display = 'inherit';
	document.getElementById('valQuality').style.display = 'inherit';

    if (name == "lowpass"){
		if(actualyPlaying == true){
			filter.type = name;
		}
		//PAS DE GAIN
	}else if (name == "highpass"){
		if(actualyPlaying == true){
			filter.type = name;
		}
		//PAS DE GAIN
	}else if (name == "bandpass"){
		if(actualyPlaying == true){
			filter.type = name;
		}
		//PAS DE GAIN
	}else if (name == "lowshelf"){
		if(actualyPlaying == true){
			filter.type = name;
		}
		//PAS DE QUALITE
		document.getElementById('qualityRangeTest').style.display = 'none';
		document.getElementById('txtQuality').style.display = 'none';
		document.getElementById('valQuality').style.display = 'none';
		document.getElementById('gainRangeTest').style.display = 'inherit';
		document.getElementById('txtGain').style.display = 'inherit';
		document.getElementById('valGain').style.display = 'inherit';
	}else if (name == "highshelf"){
		if(actualyPlaying == true){
			filter.type = name;
		}
		//PAS DE QUALITE
		document.getElementById('qualityRangeTest').style.display = 'none';
		document.getElementById('txtQuality').style.display = 'none';
		document.getElementById('valQuality').style.display = 'none';
		document.getElementById('gainRangeTest').style.display = 'inherit';
		document.getElementById('txtGain').style.display = 'inherit';
		document.getElementById('valGain').style.display = 'inherit';
	}else if (name == "peaking"){
		if(actualyPlaying == true){
			filter.type = name;
		}
		document.getElementById('gainRangeTest').style.display = 'inherit';
		document.getElementById('txtGain').style.display = 'inherit';
		document.getElementById('valGain').style.display = 'inherit';
	}else if (name == "notch"){
		if(actualyPlaying == true){
			filter.type = name;
		}
		//PAS DE GAIN
	}else if (name == "allpass"){
		if(actualyPlaying == true){
			filter.type = name;
		}
		//PAS DE GAIN
	}

}




/* PARTIE SPECTRUM */

function draw(analyser) {
    var canvas, context2, width, height, barWidth, barHeight, barSpacing, frequencyData, barCount, loopStep, i, hue;
	
    canvas = document.getElementById("spectre");
	context2 = canvas.getContext('2d');
	
    width = canvas.width;
    height = canvas.height;
 
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);
	
	//On dessine l'autre courbe au passage
	drawSpectrogram(frequencyData);
	//Ainsi que l'osciloscope
	if(debugSineWave%2 == 0){
		bufferLength = analyser.fftSize;
		dataArray = new Uint8Array(bufferLength);
		canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
		drawSineWave(dataArray);
	}
	debugSineWave++;

	
	//COURBE 3D
	drawFreqAnalysis(analyser, frequencyData, canvas);


}

/* PARTIE DISTORTION */

function makeDistortionCurve(amount) {

	//alert(amount);

  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
}



function makeDistortion(amount,numInstru) {
	
	//alert(":"+amount+":"+numInstru);
	
	//alert(distortion.oversample);
	
	if(actualyPlaying == true){

		if(distortionNodesB[parseInt(numInstru)] == false){
			//document.getElementById("buttonDistortion"+numInstru).innerHTML = "Annuler";
			distortionNodes[parseInt(numInstru)].curve = makeDistortionCurve(parseInt(amount));
			distortionNodes[parseInt(numInstru)].oversample = '4x';
			distortionNodesB[parseInt(numInstru)] = true;
		}else{
			//document.getElementById("buttonDistortion"+numInstru).innerHTML = "Distorsion";
			distortionNodes[parseInt(numInstru)].curve = makeDistortionCurve(0);
			distortionNodes[parseInt(numInstru)].oversample = 'none';
			distortionNodesB[parseInt(numInstru)] = false;
		}
	
	}
		
}




/**  SPECTRE VISUALIZATION **/
function drawSpectrogram(array) {

    // copy the current canvas onto the temp canvas
    var canvas = document.getElementById("visualizer");

    tempCtx.drawImage(canvas, 0, 0, 350, 100);

    // iterate over the elements from the array
    for (var i = 0; i < array.length; i++) {
        // draw each pixel with the specific color
        var value = array[i];
		

        ctxCanvasVisu.fillStyle = hotChroma.getColor(value).hex();

        // draw the line at the right side of the canvas
        ctxCanvasVisu.fillRect(350 - 1, 100 - i, 1, 1);
    }

    // set translate on the canvas
    ctxCanvasVisu.translate(-1, 0);
    // draw the copied image
    ctxCanvasVisu.drawImage(tempCanvas, 0, 0, 350, 100, 0, 0, 350, 100);

    // reset the transformation matrix
    ctxCanvasVisu.setTransform(1, 0, 0, 1, 0, 0);
}

function setSpectrogram(){
	//On cree un canvas pour la nouvelle anim
    ctxCanvasVisu = document.getElementById("visualizer").getContext("2d");	
	
	// create a temp canvas we use for copying
    tempCanvas = document.createElement("canvas"),
    tempCtx = tempCanvas.getContext("2d");
	tempCanvas.width=350;
	tempCanvas.height=100;
	
	//On set aussi l'osciloscope
	canvasOscil = document.getElementById("oscilloscope");
	canvasCtx = canvasOscil.getContext("2d");
}


function drawSineWave(dataArray) {

	  //drawVisual = requestAnimationFrame(drawSineWave);

	  analyser.getByteTimeDomainData(dataArray);

	  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
	  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

	  canvasCtx.lineWidth = 2;
	  canvasCtx.strokeStyle = 'rgb(0, 55, 139)';

	  canvasCtx.beginPath();

	  var sliceWidth = WIDTH * 1.0 / bufferLength;
	  var x = 0;

	  for(var i = 0; i < bufferLength; i++) {

		var v = dataArray[i] / 128.0;
		var y = v * HEIGHT/2;

		if(i === 0) {
		  canvasCtx.moveTo(x, y);
		} else {
		  canvasCtx.lineTo(x, y);
		}

		x += sliceWidth;
	  }

	  canvasCtx.lineTo(canvasOscil.width, canvasOscil.height/2);
	  canvasCtx.stroke();

}


/** COURBE PLUS JOLIE **/
function drawFreqAnalysis( analyser, bins, canvas ) {
	var canvas = canvas;
	var canvasCtx2 = canvas.getContext("2d");
	var CANVAS_WIDTH = 350;
	var CANVAS_HEIGHT = 100;
	canvasCtx2.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	var numBins = analyser.frequencyBinCount;
	numBins = numBins /4;  // this is JUST to drop the top half of the frequencies - they're not interesting.
	var binWidth = (CANVAS_WIDTH / numBins);
	//var bins = new Uint8Array(numBins);
	var SCALAR = CANVAS_HEIGHT/256;
	//analyser.getByteFrequencyData(bins);

	// Draw rectangle for each vocoder bin.
	for (var i = 0; i < numBins; i++) {
    	canvasCtx2.fillStyle = "hsl( " + Math.round((i*360)/numBins) + ", 100%, 50%)";
    	canvasCtx2.fillRect(i * binWidth, CANVAS_HEIGHT, binWidth, -bins[i]*SCALAR );
	}
}


/** COMPRESSOR PARAMS **/

function changeCompressorThreshold(value) {

	//alert(-parseInt(value));

	if(parseInt(value) > 0){
		if(actualyPlaying == true){
			compressor.threshold.value = - parseInt(value);
		}
		document.getElementById('valThreshold').innerHTML = "&nbsp;&nbsp;&nbsp;-"+value + " / -100";
	}else{
		if(actualyPlaying == true){
			compressor.threshold.value = 0;
		}
		document.getElementById('valThreshold').innerHTML = "&nbsp;&nbsp;&nbsp; "+value + " / -100";
	}
}

function changeCompressorKnee(value) {

	//alert(parseInt(value));
	if(actualyPlaying == true){
		compressor.knee.value = parseInt(value);
	}
	document.getElementById('valKnee').innerHTML = "&nbsp;&nbsp;&nbsp;"+value + " / 40";
}

function changeCompressorRatio(value) {

	//alert(parseInt(value));
	if(actualyPlaying == true){
		compressor.ratio.value = parseInt(value);
	}
	document.getElementById('valRatio').innerHTML = "&nbsp;&nbsp;&nbsp;"+value + " / 20";
}

function changeCompressorReduction(value) {

	//alert(-parseInt(value));

	if(parseInt(value) > 0){
		if(actualyPlaying == true){
			compressor.reduction.value = - parseInt(value);
		}
		document.getElementById('valReduction').innerHTML = "&nbsp;&nbsp;&nbsp;-"+value + " / -20";
	}else{
		if(actualyPlaying == true){
			compressor.reduction.value = 0;
		}
		document.getElementById('valReduction').innerHTML = "&nbsp;&nbsp;&nbsp; "+value + " / -20";
	}

}

function changeCompressorAttack(value) {

	//alert(parseFloat(value)/1000);
	if(actualyPlaying == true){
		compressor.attack.value = parseFloat(value)/1000;
	}
	document.getElementById('valAttack').innerHTML = "&nbsp;&nbsp;&nbsp;0."+value + " / 1.000";
}

function changeCompressorRelease(value) {

	//alert(parseFloat(value)/100);

	if(actualyPlaying == true){
		compressor.release.value = parseFloat(value)/100;
	}
	document.getElementById('valRelease').innerHTML = "&nbsp;&nbsp;&nbsp;0."+value + " / 1.00";
}



/* REVERBERATION */
function addReverb(nb,piste){

if(actualyPlaying == true){

	if(reverbe == 0){		
		
		var urll = "/reverb/"+rev[parseInt(piste)];
		
		var soundSource, concertHallBuffer;

		ajaxRequest = new XMLHttpRequest();
		ajaxRequest.open('GET', urll, true);
		ajaxRequest.responseType = 'arraybuffer';

		ajaxRequest.onload = function() {
		
		
		  var audioData = ajaxRequest.response;
		  context.decodeAudioData(audioData, function(buffer) {

			  concertHallBuffer = buffer;
			  soundSource = context.createBufferSource();
			  soundSource.buffer = concertHallBuffer;
			  
				convolver = context.createConvolver();
	
				convolver.buffer = soundSource.buffer;
				//alert(tmpBuffer);
				filter.connect(convolver);
				convolver.connect(context.destination);
				
				reverbe = 1;
				
				document.getElementById('buttonReverb').innerHTML = "Désactiver Reverb";
				
			}, function(e){"Error with decoding audio data" + e.err});
		}

		ajaxRequest.send();
	
	}else{
		filter.disconnect(0);
		convolver.disconnect(0);
		
		filter.connect(context.destination);
		filter.connect(analyser);
		
		reverbe = 0;
		
		document.getElementById('buttonReverb').innerHTML = "Faire une Reverb";
	}
	
}
	
}

var rev = [];
rev[0] = "BlockInside.wav";
rev[1] = "BottleHall.wav";
rev[2] = "CementBlocks1.wav";
rev[3] = "CementBlocks2.wav";
rev[4] = "ChateaudeLogne,Outside.wav";
rev[5] = "ConicLongEchoHall.wav";
rev[6] = "DeepSpace.wav";
rev[7] = "DerlonSanctuary.wav";
rev[8] = "DirectCabinetN1.wav";
rev[9] = "DirectCabinetN2.wav";
rev[10] = "DirectCabinetN3.wav";
rev[11] = "DirectCabinetN4.wav";
rev[12] = "FiveColumnsLong.wav";
rev[13] = "FiveColumns.wav";
rev[14] = "French18thCenturySalon.wav";
rev[15] = "GoingHome.wav";
rev[16] = "Greek7EchoHall.wav";
rev[17] = "HighlyDampedLargeRoom.wav";
rev[18] = "InTheSiloRevised.wav";
rev[19] = "InTheSilo.wav";
rev[20] = "LargeBottleHall.wav";
rev[21] = "LargeLongEchoHall.wav";
rev[22] = "LargeWideEchoHall.wav";
rev[23] = "MasonicLodge.wav";
rev[24] = "Musikvereinsaal.wav";
rev[25] = "NarrowBumpySpace.wav";
rev[26] = "NiceDrumRoom.wav";
rev[27] = "OnaStar.wav";
rev[28] = "ParkingGarage.wav";
rev[29] = "Rays.wav";
rev[30] = "RightGlassTriangle.wav";
rev[31] = "RubyRoom.wav";
rev[32] = "ScalaMilanOperaHall.wav";
rev[33] = "SmallDrumRoom.wav";
rev[34] = "SmallPrehistoricCave.wav";
rev[35] = "StNicolaesChurch.wav";
rev[36] = "TrigRoom.wav";
rev[37] = "VocalDuo.wav";







/**
	PARTIE EGALISEUR
**/
function changeGain(string,type,nb)
{
  if(type.indexOf("lGain") > -1) type = "lGain";
  if(type.indexOf("mGain") > -1) type = "mGain";
  if(type.indexOf("hGain") > -1) type = "hGain";
  
  var value = parseFloat(string) / 100.0;
  
  switch(type)
  {
    case 'lGain': lGain[parseInt(nb)].gain.value = value; break;
    case 'mGain': mGain[parseInt(nb)].gain.value = value; break;
    case 'hGain': hGain[parseInt(nb)].gain.value = value; break;
  }
}




/**
	PARTIE MONO/STEREO
**/

stereo = true;
function changeMonoStereo(nb) {

	//alert(parseFloat(value)/100);

	if(actualyPlaying == true){
		//compressor.release.value = parseFloat(value)/100;
		
		if(stereo == true){
			buttonMonoStereo[parseInt(nb)].innerHTML = "Stereo";
			stereo = false;
		}else{
			buttonMonoStereo[parseInt(nb)].innerHTML = "Mono";
			stereo = true;
		}
	}
	
}