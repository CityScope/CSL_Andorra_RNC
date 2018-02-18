function animPeople(data) {

	// uses lodash `mapValues` and `groupBy`
	var groupIt = function (seq, keys) {
		if (!keys.length)
			return seq;
		var first = keys[0];
		var rest = keys.slice(1);
		return _.mapValues(_.groupBy(seq, first), function (value) {
			return groupIt(value, rest)
		});
	};

	//data managmemnt 
	/////////////////////////////////////////////////
	// clone the original data obj and sort 
	// into a group of people with the same start time 
	// the start time of the first object in the group 
	// if this time is also the start time for a group of people's stay AND counter is smaller than cloneData array 

	groupedData = Object.values(groupIt(data, ['S[0].s']))
	GroupTimes = Object.keys(groupIt(data, ['S[0].s']))
	console.log(GroupTimes, groupedData)
	//THREE static vars 
	var pplGrp = new THREE.Object3D();
	var pplTexture = new THREE.TextureLoader().load("img/lf4.png");


	var timeDiv = document.getElementById("timeDiv");



	for (var j = 0; j <= groupedData.length; j++) {
		(function (i) {
			setTimeout(function () {
				drawGrp(i)
				timeDiv.innerHTML = new Date((dataDate + i) * 1000)

			}, (1 * i));
		})(j);
	}
	function drawGrp(i) {
		let grp = groupedData[i];
		for (let person = 0; person < grp.length; person++) {
			var spriteMaterial = new THREE.SpriteMaterial({
				map: pplTexture,
				transparent: true
			});
			var pplSprite = new THREE.Sprite(spriteMaterial);
			pplSprite.material.color.setHex(colorByNation(grp[person].N));
			pplSprite.material.blending = THREE.AdditiveBlending;
			pplSprite.position.set(latCor(grp[person].S[0].la),
				(grp[person].S[0].s - dataDate) / 600,
				// 0,
				lonCor(grp[person].S[0].lo));
			if (grp[person].N != "Andorra") {
				pplSprite.scale.set(5, 5, 5);
			} else {
				pplSprite.scale.set(1, 1, 1);
			}
			scene.add(pplSprite);
		}
	}
}

function animateThisStay(obj, stayEvent) {
	for (let e = 0; e < Object.keys(stayEvent).length; e++) {
		var tween = new TWEEN.Tween(obj.position).to({
			x: latCor(stayEvent[e].la),
			// y: (stayEvent[e].l + stayEvent[e].s) / 60,
			y: 0,
			z: lonCor(stayEvent[e].lo)
		}, stayEvent[e].l).start();
	}
}