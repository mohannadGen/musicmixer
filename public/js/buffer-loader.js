tmpBuffer = "0";

function BufferLoader(context, urlList, callback, callbackDraw) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = [];
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    console.log('file : ' + url + " loading and decoding");

    var request = new XMLHttpRequest();

    request.open("GET", url, true);

    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {

        // Asynchronously decode the audio file data in request.response

        loader.context.decodeAudioData(
                request.response,
                function(buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }

                    loader.bufferList[index] = buffer;

                    console.log("In bufferLoader.onload bufferList size is " + loader.bufferList.length + " index =" + index);
                    if (++loader.loadCount == loader.urlList.length){
                        loader.onload(loader.bufferList);
					}

					/**
					*	POUR DESSINER LES COURBES
					*	@see drawTrack()
					**/
					drawTrack(loader.bufferList[index],nbInstrumentsMusique,index);

					//On fixe le mute a 1
					mute[index] = 1;

					hGainSave[index]=50;
					mGainSave[index]=50;
					lGainSave[index]=50;
                },
                function(error) {
                    console.error('decodeAudioData error', error);
                }
        );
    };

    request.onprogress = function(e) {
        //console.log("loaded : " + e.loaded + " total : " + e.total);
    };

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    };

    request.send();
};

BufferLoader.prototype.load = function() {
    // M.BUFFA added these two lines.
    this.bufferList = [];
    this.loadCount = 0;
    console.log("BufferLoader.prototype.load urlList size = " + this.urlList.length);
	//On compte les instrument (dsl c'est a l'arrache :p)

    nbInstrumentsMusique = this.urlList.length;

    for (var i = 0; i < this.urlList.length; i++){
        console.log('Curr URL ' + this.urlList[i]);
        this.loadBuffer(this.urlList[i], i);
	}
};

/**
*	POUR DESSINER LES COURBES
*	@see loadBuffer()
**/
function drawTrack(decodedBuffer,nb,nbI){
	//alert("decodedBuffer ="+decodedBuffer);
	//alert("nb ="+nb);
	//alert("nbI ="+nbI);

	//var canvas = document.getElementById('canvasFront');
	var canvas = document.getElementById('myCanvas');

	waveformDrawer.init(decodedBuffer, canvas, 'green');
	// First parameter = Y position (top left corner)
	// second = height of the sample drawing
	waveformDrawer.drawWave((((canvas.height/nb)*(nbI))+(canvas.height/nb)*0.2), ((canvas.height/nb)-(canvas.height/nb)*0.4));
	//waveformDrawer.drawWave(0, canvas.height);
}
