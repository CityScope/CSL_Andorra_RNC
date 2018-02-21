function animPeople(data) {

	/////////////////////////////////////////////////
	//data managmemnt 
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

	// clone the original data obj and sort it
	// into a group of people with the same start time 
	groupedData = Object.values(groupIt(data, ['S[0].s']))

	// the start time of the first object in the group 
	// if this time is also the start time for a group of 
	// people's stay
	GroupTimes = Object.keys(groupIt(data, ['S[0].s']))
	//THREE static vars 
	var pplGrp = new THREE.Object3D();
	var pplTexture = new THREE.TextureLoader().load("img/lf4.png");

	var timeDiv = document.getElementById("timeDiv");

	//delay method for spawning groups 
	for (var j = 0; j <= groupedData.length; j++) {
		(function (i) {
			setTimeout(function () {
				//call drwaing method
				drawGrp(i)
				//epoch time to GMT into div
				timeDiv.innerHTML = new Date((GroupTimes[i]) * 1000)
				// the delay time times the iterator 
			}, ((GroupTimes[i] - dataDate) * i) / 10);
		})(j);
	}

	// the drawing function itself
	function drawGrp(i) {
		let grp = groupedData[i];
		//fix nulled group 
		if (grp) {
			for (let person = 0; person < grp.length; person++) {
				var spriteMaterial = new THREE.SpriteMaterial({
					map: pplTexture,
					transparent: true
				});
				var pplSprite = new THREE.Sprite(spriteMaterial);
				pplSprite.material.color.setHex(colorByNation(grp[person].N));
				pplSprite.material.blending = THREE.AdditiveBlending;
				pplSprite.material.transparent = true;
				pplSprite.scale.set(5, 5, 5);

				//location of each object
				pplSprite.position.set(latCor(grp[person].S[0].la),
					// (grp[person].S[0].s - dataDate) / 600,
					0,
					lonCor(grp[person].S[0].lo));
				if (grp[person].N != "Andorra") {
					pplSprite.material.opacity = 1;

				} else {
					pplSprite.material.opacity = 0.25;
				}

				//pass stay events of person and it's visual rep. to anim method
				animateThisStay(pplSprite, Object.values(grp[person].S));

				// add name for text div to read from 
				pplSprite.name =
					"From " + (grp[person].N) + "  and stayed " +
					Object.values(grp[person].S).length + " times."
				scene.add(pplSprite);
			}
		}
	}
}

function animateThisStay(obj, personStayEvents) {
	if (personStayEvents.length > 1) {
		for (let e = 0; e < personStayEvents.length; e++) {
			var tween = new TWEEN.Tween(obj.position).to({
				x: latCor(personStayEvents[e].la),
				// y: (personStayEvents[e].l) / 600,
				y: 0,
				z: lonCor(personStayEvents[e].lo)
			}, personStayEvents[e].l / 10).start();
		}
	} else {
		var tween = new TWEEN.Tween(obj.position).to({
			x: latCor(personStayEvents[0].la),
			y: (personStayEvents[0].l) / 600,
			// y: 0,
			z: lonCor(personStayEvents[0].lo)
		}, personStayEvents[0].l).start();

	}
}


// Raycast shows details and anim of user 
function raycastPersonDetails() {
	let tDiv = document.getElementById("timeDiv");
	//set raytrecer 
	raycaster.setFromCamera(mouse, camera);
	//find interactions 
	intersections = raycaster.intersectObjects(scene.children);
	intersection = (intersections.length) > 0 ? intersections[0] : null;
	if (intersection) {
		// document.body.style.cursor = 'none';
		tDiv.innerHTML = intersection.object.name;
		tweenThis(intersection.object);
	}
}

function tweenThis(obj) {
	let preScale = new THREE.Vector3(3, 3, 3)
	let postScale = new THREE.Vector3(15, 15, 15);
	let tweenA = new TWEEN.Tween(obj.scale)
		.to(postScale, 50);
	let tweenBack = new TWEEN.Tween(obj.scale)
		.to(preScale, 1000);

	tweenA.chain(tweenBack).start();
}