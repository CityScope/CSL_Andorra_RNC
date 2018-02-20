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

	/////////////////////////////////////////////////
	//data managmemnt 

	// clone the original data obj and sort it
	// into a group of people with the same start time 
	// the start time of the first object in the group 
	// if this time is also the start time for a group of 
	// people's stay AND counter is smaller than cloneData array 

	groupedData = Object.values(groupIt(data, ['S[0].s']))
	GroupTimes = Object.keys(groupIt(data, ['S[0].s']))

	//THREE static vars 
	var pplGrp = new THREE.Object3D();
	var pplTexture = new THREE.TextureLoader().load("img/lf4.png");

	var timeDiv = document.getElementById("timeDiv");

	for (var j = 0; j <= groupedData.length; j++) {
		(function (i) {
			setTimeout(function () {
				drawGrp(i)
				timeDiv.innerHTML = new Date((dataDate + i) * 1000)

			}, (100 * i));
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

			//pass stay events of person and it's visual rep. to anim method
			animateThisStay(pplSprite, Object.values(grp[person].S));

			pplSprite.name =
				"From " + (grp[person].N) + "  and stayed " +
				Object.values(grp[person].S).length + " times"

			scene.add(pplSprite);

		}
	}
}

function animateThisStay(obj, personStayEvents) {

	for (let e = 0; e < personStayEvents.length; e++) {

		var tween = new TWEEN.Tween(obj.position).to({
			x: latCor(personStayEvents[e].la),
			// y: (personStayEvents[e].l) / 600,
			y: 0,
			z: lonCor(personStayEvents[e].lo)
		}, personStayEvents[e].l).start();
	}
}

function raycastPersonDetails() {
	let tDiv = document.getElementById("timeDiv");

	raycaster.setFromCamera(mouse, camera);

	intersections = raycaster.intersectObjects(scene.children);
	intersection = (intersections.length) > 0 ? intersections[0] : null;
	if (intersection) {
		// document.body.style.cursor = 'none';
		tDiv.innerHTML = intersection.object.name;
		tweenThis(intersection.object.scale);
	}
}

function tweenThis(objScale) {
	let tween = new TWEEN.Tween(objScale).to({
		x: 10,
		y: 10,
		z: 10
	}, 250).start();
}