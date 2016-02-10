/**

 Ce qu'il reste � faire concr�tement (liste non exhaustive)

	ok = faisable
	x = compliqu� a faire

    ok) Ergonomie meilleure, interface plus belle,
    ok) Mod�le de donn� plus complet (titres des chansons complet, biographie de l'artiste, histoire de la chanson, nom des musiciens, etc),
    ok) Possibilit� de r�gler par piste, la st�r�o, l'�galisation, delay, etc. FAIRE UNE VRAIE TABLE DE MIXAGE!
    ok pour statique) Sauvegarder et partager les r�glages du mix d'une chanson, pouvoir importer depuis un serveur des mixes faits par les autres...
    x) Zoom avant/arri�re sur les �chantillons (donc il faudra dessiner les �chantillons et non pas juste afficher une image pr�d�finie, on verra comment faire...)


**/

function saveStatique(){

	var stringJSON = "{ ";

	//en aattendant
	var valNonImplemented = 0

	//STEP 1 On r�cup�re toutes les valeurs

		//PARTIE PISTE PAR PISTE

		//On r�cup�re les mute
		stringJSON = stringJSON + "\"mute\": [ ";
		for(var nbInstr = 0; nbInstr < nbInstrumentsMusique; nbInstr++){
			if( nbInstr != (nbInstrumentsMusique - 1)){
				stringJSON = stringJSON + "{ \"numInstrument\": " + nbInstr + ", \"valeur\": " + mute[nbInstr] + " },";
			}else{
				stringJSON = stringJSON + "{ \"numInstrument\": " + nbInstr + ", \"valeur\": " + mute[nbInstr] + " }";
			}
		}
		stringJSON = stringJSON + " ], ";

		//On r�cup�re les volumes
		stringJSON = stringJSON + "\"volume\": [ ";
		for(var nbInstr = 0; nbInstr < nbInstrumentsMusique; nbInstr++){
			if( nbInstr != (nbInstrumentsMusique - 1)){
				stringJSON = stringJSON + "{ \"numInstrument\": " + nbInstr + ", \"valeur\": " + document.getElementById("volume2RangeTest"+nbInstr).value + " },";
			}else{
				stringJSON = stringJSON + "{ \"numInstrument\": " + nbInstr + ", \"valeur\": " + document.getElementById("volume2RangeTest"+nbInstr).value + " }";
			}
		}
		stringJSON = stringJSON + " ], ";

		//On r�cup�re les delay
		stringJSON = stringJSON + "\"delay\": [ ";
		for(var nbInstr = 0; nbInstr < nbInstrumentsMusique; nbInstr++){
			if( nbInstr != (nbInstrumentsMusique - 1)){
				stringJSON = stringJSON + "{ \"numInstrument\": " + nbInstr + ", \"valeur\": " + valNonImplemented + " },";
			}else{
				stringJSON = stringJSON + "{ \"numInstrument\": " + nbInstr + ", \"valeur\": " + valNonImplemented + " }";
			}
		}
		stringJSON = stringJSON + " ], ";

		//On r�cup�re les egaliseur

		stringJSON = stringJSON + "\"egaliseur\": [ ";
		for(var nbInstr = 0; nbInstr < nbInstrumentsMusique; nbInstr++){
			if( nbInstr != (nbInstrumentsMusique - 1)){
				stringJSON = stringJSON + "{ \"numInstrument\": " + nbInstr + ", \"valeurL\": " + lGainSave[nbInstr] + ", \"valeurM\": " + mGainSave[nbInstr] + ", \"valeurH\": " + hGainSave[nbInstr] + " },";
			}else{
				stringJSON = stringJSON + "{ \"numInstrument\": " + nbInstr + ", \"valeurL\": " + lGainSave[nbInstr] + ", \"valeurM\": " + mGainSave[nbInstr] + ", \"valeurH\": " + hGainSave[nbInstr] + " } ";
			}
		}
		stringJSON = stringJSON + " ], ";

		//On r�cup�re les stereo
		stringJSON = stringJSON + "\"stereo\": [ ";
		for(var nbInstr = 0; nbInstr < nbInstrumentsMusique; nbInstr++){
			if( nbInstr != (nbInstrumentsMusique - 1)){
				stringJSON = stringJSON + "{ \"numInstrument\": " + nbInstr + ", \"valeur\": " + valNonImplemented + " },";
			}else{
				stringJSON = stringJSON + "{ \"numInstrument\": " + nbInstr + ", \"valeur\": " + valNonImplemented + " }";
			}
		}
		stringJSON = stringJSON + " ], ";


		//PARTIE CONTEXT DESTINATION

		//On recup�re le volume
		stringJSON = stringJSON + "\"volumeD\": [ ";
		stringJSON = stringJSON + "{ \"valeur\": " + document.getElementById("masterVolume").value + " }";
		stringJSON = stringJSON + " ], ";

		//On recup�re la reverb
		stringJSON = stringJSON + "\"reverbD\": [ ";
		stringJSON = stringJSON + "{ \"valeur\": " + document.getElementById("selectReverb").value + " }";
		stringJSON = stringJSON + " ], ";

		//On r�cup�re la compression
		// stringJSON = stringJSON + "\"compressionD\": [ ";
		// stringJSON = stringJSON + "{ \"valeurThreshold\": " + document.getElementById("thresholdRangeTest").value + " },";
		// stringJSON = stringJSON + "{ \"valeurKnee\": " + document.getElementById("kneeRangeTest").value + " },";
		// stringJSON = stringJSON + "{ \"valeurRatio\": " + document.getElementById("ratioRangeTest").value + " },";
		// stringJSON = stringJSON + "{ \"valeurReduction\": " + document.getElementById("reductionRangeTest").value + " },";
		// stringJSON = stringJSON + "{ \"valeurAttack\": " + document.getElementById("attackRangeTest").value + " },";
		// stringJSON = stringJSON + "{ \"valeurRelease\": " + document.getElementById("releaseRangeTest").value + " }";
		// stringJSON = stringJSON + " ], ";

		//On r�cup�re la compression
		stringJSON = stringJSON + "\"filterD\": [ ";
		stringJSON = stringJSON + "{ \"valeurFilter\": \"" + document.getElementById('filterTest').value + "\" },";
		stringJSON = stringJSON + "{ \"valeurFrequency\": " + document.getElementById("frequencyRangeTest").value + " },";
		stringJSON = stringJSON + "{ \"valeurQuality\": " + document.getElementById("qualityRangeTest").value + " },";
		stringJSON = stringJSON + "{ \"valeurGain\": " + document.getElementById("gainRangeTest").value + " }";
		stringJSON = stringJSON + " ] ";


		//On ferme le json
		stringJSON = stringJSON + " } ";

		$.post("/play/<%= songname %>/saveSettings",{
	        settings: stringJSON
	    }).done(function(data){
	    });

}


var utilisateur = "owner";
function loadParameters(){
	var stringJSON;
	$.get("/play/<%= songname %>/loadSettings", function(data){
		stringJSON = data;
    });
	
	if(utilisateur == "owner"){

		//On pr�charge tous les param�tres

		//1) le volume g�n�ral
		setMasterVolume();

		//2) les mute de chaques pistes
		for(var nbInstr = 0; nbInstr < nbInstrumentsMusique; nbInstr++){
			if(mute[nbInstr] == 0){
				trackVolumeNodes[nbInstr].gain.value = mute[nbInstr];
			}
		}

		//3) les volumes de chaques pistes
		for(var nbInstr = 0; nbInstr < nbInstrumentsMusique; nbInstr++){
			if(trackVolumeNodes[nbInstr].gain.value != 0){
				var volumeP = parseFloat(document.getElementById('volume2RangeTest'+nbInstr).value);
				trackVolumeNodes[nbInstr].gain.value = volumeP/120;
			}
		}

		//4) les egaliseurq de chaques pistes
		for(var nbInstr = 0; nbInstr < nbInstrumentsMusique; nbInstr++){
			lGain[nbInstr].gain.value = parseFloat(document.getElementById('lGain'+nbInstr).value/100);
			mGain[nbInstr].gain.value = parseFloat(document.getElementById('mGain'+nbInstr).value/100);
			hGain[nbInstr].gain.value = parseFloat(document.getElementById('hGain'+nbInstr).value/100);
		}

		//5) la compression
		// compressor.threshold.value = document.getElementById('thresholdRangeTest').value;
		// compressor.knee.value = document.getElementById('kneeRangeTest').value;
		// compressor.ratio.value = document.getElementById('ratioRangeTest').value;
		// compressor.reduction.value = document.getElementById('reductionRangeTest').value;
		// compressor.attack.value = document.getElementById('attackRangeTest').value;
		// compressor.release.value = document.getElementById('releaseRangeTest').value;

		//6) le filtre
		filter.type = document.getElementById('filterTest').value;
		filter.frequency.value = document.getElementById('frequencyRangeTest').value;
		filter.Q.value = document.getElementById('qualityRangeTest').value;
		filter.gain.value = document.getElementById('gainRangeTest').value;

		//ON REFRESH LES DISTORSIONS (desactivation si active)
		for(var nbInstr = 0; nbInstr < nbInstrumentsMusique; nbInstr++){
			if(distortionNodesB[nbInstr] == true){
				distortionNodes[nbInstr].curve = makeDistortionCurve(0);
				distortionNodes[nbInstr].oversample = 'none';
				distortionNodesB[nbInstr] = false;
				document.getElementById("buttonDistortion"+nbInstr).innerHTML = "Distorsion";
			}
		}

		//ON REFRESH LA REVERBERATION (desactivation si active)
		if(reverbe == 1){
				filter.disconnect(0);
				convolver.disconnect(0);

				filter.connect(context.destination);
				filter.connect(analyser);

				reverbe = 0;

				document.getElementById('buttonReverb').innerHTML = "Faire une Reverb";
		}
	}
}
