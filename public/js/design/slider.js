
function createSlider(nameSlider,nameValue,nb){
	
	nameSlider = "#"+nameSlider;
	nameValue = "#"+nameValue;
	var val = 0;
	
	$( nameSlider ).slider({
		  orientation: "vertical",
		  range: "min",
		  min: 0,
		  max: 100,
		  value: 50,
		  slide: function( event, ui ) {
			$( nameValue ).val( ui.value );
			val = ui.value;
			hGainSave[parseInt(nb)] = ui.value; 
			if(actualyPlaying == true){
				changeGain(val,nameValue,nb);
		    }
		  }
	});

	$( nameValue ).val( $( nameSlider ).slider( "value" ) );
	
	
}
