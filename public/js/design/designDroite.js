(function($){

	var topRound = -100;

	$('input.round').wrap('<div class="round" />').each(function(){

		topRound = topRound + 100;

		var $input = $(this);
		var $div = $input.parent();

		$div.css("top", topRound + "px");

		var min = $input.data('min');
		var max = $input.data('max');
		var ratio = ($input.val() - min) / (max - min);
		var color = $input.data('color') ? $input.data('color') :  "#00558b";

		var $circle = $('<canvas width="200px" height="200px" style="cursor:pointer" />');
		var $color = $('<canvas width="200px" height="200px" style="cursor:pointer" />');
		$div.append($circle);
		$div.append($color);
		ctxRound = $circle[0].getContext('2d');

		// On dessine le cercle blanc avec ombre porté
		ctxRound.beginPath();
		ctxRound.arc(100,100,85,0,2*Math.PI);
		ctxRound.lineWidth = 20;
		ctxRound.strokeStyle = "#d1d1d1"
		ctxRound.shadowOffsetX = 2;
		ctxRound.shadowBlur = 5;
		ctxRound.shadowColor="rgba(0,0,0,0.1)";
		ctxRound.stroke();

		// On dessine le certcle de couleur
		var ctxRound = $color[0].getContext('2d');
		ctxRound.beginPath();
		ctxRound.arc(100,100,85,-1/2 * Math.PI, ratio*2*Math.PI - 1/2 * Math.PI );
		ctxRound.lineWidth = 20;
		ctxRound.strokeStyle = color;
		ctxRound.stroke();

		// Lorsqu'on appuie sur la souris
		$div.mousedown(function(event){
			event.preventDefault();
			// On écoute le déplacement du curseur
			$div.bind('mousemove', function(event){
				// On trouve l'angle a (en %) fait par le curseur
				var x = event.pageX - $div.offset().left - 80/2;
				var y = event.pageY - $div.offset().top - 80/2;
				var a = Math.atan2(x,-y) / (2*Math.PI);
				if(a < 0){ a+=1; }
				// On nettoie la zone de dessin
				ctxRound.clearRect(0,0,200,200);
				// Et on redessine le cercle
				ctxRound.beginPath();
				ctxRound.arc(100,100,85,-1/2 * Math.PI, a*2*Math.PI - 1/2 * Math.PI );
				ctxRound.lineWidth = 20;
				ctxRound.strokeStyle = color;
				ctxRound.stroke();
				$input.val(Math.round(a * (max - min) + min));
			})



		// On coupe les évènement lorsqu'on lache le bouton de la souris
		}).mouseup(function(event){
			event.preventDefault();
			$div.unbind('mousemove');
		})

	})

})(jQuery);


imageOff = new Image();
imageOff.src = "/img/off.png";
imageOn = new Image();
imageOn.src = "/img/on.png";


function changeImgDisto(id,nb){
	//si le bouton est activable, on change l'image
	if(document.getElementById("buttonDistortion"+nb).disabled == false){
		if (onOff[parseInt(nb)] == 0) {
			document.getElementById(id).src = imageOn.src;
			onOff[parseInt(nb)] = 1;
			
		} else {
			document.getElementById(id).src = imageOff.src;
			onOff[parseInt(nb)] = 0;
		}
	}
	
}