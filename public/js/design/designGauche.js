bouton_play_selected = false;
bouton_pause_selected = false;
bouton_stop_selected = false;

//On precharge les images play/pause/stop
imagePlay = new Image();
imagePlay.src = "/img/play.png";
imagePlay2 = new Image();
imagePlay2.src = "/img/play2.png";

imageStop = new Image();
imageStop.src = "/img/stop.png";
imageStop2 = new Image();
imageStop2.src = "/img/stop2.png";

imagePause = new Image();
imagePause.src = "/img/pause.png";
imagePause2 = new Image();
imagePause2.src = "/img/pause2.png";

//On precharge les images mute / unmute
imageMute = new Image();
imageMute.src = "/img/mute.png";
imageUnmute = new Image();
imageUnmute.src = "/img/unmute.png";

//On precharge les images du volume
imageVolume0 = new Image();
imageVolume0.src = "/img/volume/volume0.png";
imageVolume1 = new Image();
imageVolume1.src = "/img/volume/volume1.png";
imageVolume2 = new Image();
imageVolume2.src = "/img/volume/volume2.png";
imageVolume3 = new Image();
imageVolume3.src = "/img/volume/volume3.png";
imageVolume4 = new Image();
imageVolume4.src = "/img/volume/volume4.png";
imageVolume5 = new Image();
imageVolume5.src = "/img/volume/volume5.png";
imageVolume6 = new Image();
imageVolume6.src = "/img/volume/volume6.png";
imageVolume7 = new Image();
imageVolume7.src = "/img/volume/volume7.png";
imageVolume8 = new Image();
imageVolume8.src = "/img/volume/volume8.png";
imageVolume9 = new Image();
imageVolume9.src = "/img/volume/volume9.png";
imageVolume10 = new Image();
imageVolume10.src = "/img/volume/volume10.png";
imageVolume11 = new Image();
imageVolume11.src = "/img/volume/volume11.png";
imageVolume12 = new Image();
imageVolume12.src = "/img/volume/volume12.png";


//on les stock dans un tableau
listeImageVolume = new Array();
listeImageVolume[0] = imageVolume0.src;
listeImageVolume[1] = imageVolume1.src;
listeImageVolume[2] = imageVolume2.src;
listeImageVolume[3] = imageVolume3.src;
listeImageVolume[4] = imageVolume4.src;
listeImageVolume[5] = imageVolume5.src;
listeImageVolume[6] = imageVolume6.src;
listeImageVolume[7] = imageVolume7.src;
listeImageVolume[8] = imageVolume8.src;
listeImageVolume[9] = imageVolume9.src;
listeImageVolume[10] = imageVolume10.src;
listeImageVolume[11] = imageVolume11.src;
listeImageVolume[12] = imageVolume12.src;



function changeVolumeImg(element){

	var volume = parseInt(document.getElementById('masterVolume').value)/10;
	
	var src = listeImageVolume[parseInt(volume)];
	
	document.getElementById('imageVolume').src = src;
}

function muteUnmuteImg(numT){

	var id = "imgMute"+numT;

	if (mute[parseInt(numT)] == 0) {
		document.getElementById(id).src = imageUnmute.src;
		mute[parseInt(numT)] = 1;
		
    } else {
		document.getElementById(id).src = imageMute.src;
		mute[parseInt(numT)] = 0;
    }
	
}

function changePlayImg(){
	if(actualyPlaying){
		document.getElementById('imgPlay').src = imagePlay2.src;
		document.getElementById('imgPause').src = imagePause.src;
		document.getElementById('imgStop').src = imageStop.src;
	}else{
		document.getElementById('imgPlay').src = imagePlay.src;
	}
}

function changePauseImg(){
	if(actualyPlaying){
		document.getElementById('imgPlay').src = imagePlay2.src;
		document.getElementById('imgPause').src = imagePause.src;
		
	}else{
		document.getElementById('imgPlay').src = imagePlay.src;
		document.getElementById('imgPause').src = imagePause2.src;
	}
}

function changeStopImg(){
	
	document.getElementById('imgPlay').src = imagePlay.src;
	document.getElementById('imgPause').src = imagePause.src;
	document.getElementById('imgStop').src = imageStop2.src;
	
}






//On precharge les images du volume
imageVolumeB0 = new Image();
imageVolumeB0.src = "/img/volume2/pistSong1.png";
imageVolumeB1 = new Image();
imageVolumeB1.src = "/img/volume2/pistSong2.png";
imageVolumeB2 = new Image();
imageVolumeB2.src = "/img/volume2/pistSong3.png";
imageVolumeB3 = new Image();
imageVolumeB3.src = "/img/volume2/pistSong4.png";
imageVolumeB4 = new Image();
imageVolumeB4.src = "/img/volume2/pistSong5.png";
imageVolumeB5 = new Image();
imageVolumeB5.src = "/img/volume2/pistSong6.png";
imageVolumeB6 = new Image();
imageVolumeB6.src = "/img/volume2/pistSong7.png";
imageVolumeB7 = new Image();
imageVolumeB7.src = "/img/volume2/pistSong8.png";
imageVolumeB8 = new Image();
imageVolumeB8.src = "/img/volume2/pistSong9.png";
imageVolumeB9 = new Image();
imageVolumeB9.src = "/img/volume2/pistSong10.png";
imageVolumeB10 = new Image();
imageVolumeB10.src = "/img/volume2/pistSong11.png";

//on les stock dans un tableau
listeImageVolume2 = new Array();
listeImageVolume2[0] = imageVolumeB10.src;
listeImageVolume2[1] = imageVolumeB9.src;
listeImageVolume2[2] = imageVolumeB8.src;
listeImageVolume2[3] = imageVolumeB7.src;
listeImageVolume2[4] = imageVolumeB6.src;
listeImageVolume2[5] = imageVolumeB5.src;
listeImageVolume2[6] = imageVolumeB4.src;
listeImageVolume2[7] = imageVolumeB3.src;
listeImageVolume2[8] = imageVolumeB2.src;
listeImageVolume2[9] = imageVolumeB1.src;
listeImageVolume2[10] = imageVolumeB0.src;


function changeVolume2(val,nb){
	
	var volume = parseInt(document.getElementById('volume2RangeTest'+nb).value)/11;
	//alert(val+"et"+nb);
			
	var src = listeImageVolume2[parseInt(volume)];
	
	//On change l'image si ==0, l'effet pris en compte lorsque start la musique
	document.getElementById('imageVolume2'+nb).src = src;
	
	if(mute[nb] == 1){
		
		trackVolumeNodes[parseInt(nb)].gain.value = parseInt(val)/100;
	}
}