// MOUSE AND RAYCAST
var mouse = new THREE.Vector2();
var mouseX = 0,
	mouseY = 0;
var raycaster = new THREE.Raycaster();
var threshold = 0.1;
raycaster.params.Points.threshold = threshold;


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
	var groupedData = Object.values(groupIt(data, ['S[0].s']))

	// the start time of the first object in the group 
	// if this time is also the start time for a group of 
	// people's stay
	var GroupTimes = Object.keys(groupIt(data, ['S[0].s']))

	//THREE static vars 
	var pplTexture = new THREE.TextureLoader().load("img/lf4.png");

	// Div text 
	var timeDiv = document.getElementById("timeDiv");

	//delay loop for spawning ppl groups 
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

				//location of first known pnt of this peron in this gorup  // (grp[person].S[0].s - dataDate) / 600,
				pplSprite.position.set(latCor(grp[person].S[0].la), 0, lonCor(grp[person].S[0].lo));

				// lower opacity for andorra 
				if (grp[person].N != "Andorra") {
					pplSprite.material.opacity = 1;
				} else {
					pplSprite.material.opacity = 0.25;
				}

				// add name for text div to read from 
				pplSprite.name =
					"From " + (grp[person].N) + "  and stayed " +
					Object.values(grp[person].S).length + " times."

				//add this person to scene 
				scene.add(pplSprite);

				//pass stay events of person and it's visual rep. to anim method
				animStays(pplSprite, Object.values(grp[person].S));

				//Draw lines for each person
				let pLine = drawLine(grp[person], pplSprite, pplSprite.material.opacity);
				pplLinesGrp.add(pLine);
			}
		}
	}
	scene.add(pplLinesGrp);
	//start with hidden lines 
	pplLinesGrp.visible = false;
}

function drawLine(person, personSptire, opacity) {
	//line vars
	person = Object.values(person.S);
	var color = new THREE.Color();
	var geometry = new THREE.Geometry();
	var personStayLine = null;

	//itiirate through person's stay events
	for (let i = 0; i < person.length; i++) {

		let p = new THREE.Vector3();
		p.x = latCor(person[i].la);
		p.y = (person[i].s - dataDate) / 600; //start time for stay event as Y axis 
		// p.y = 0
		p.z = lonCor(person[i].lo);

		//push vertices 
		geometry.vertices.push(new THREE.Vector3(p.x, p.y, p.z));
		//push the  'stay' time as vertical Y axis 
		geometry.vertices.push(new THREE.Vector3(p.x, p.y + person[i].l / 600, p.z));
	}
	var material = new THREE.LineBasicMaterial({
		color: personSptire.material.color,
	});
	personStayLine = new THREE.Line(geometry, material);
	personStayLine.name = personSptire.uuid;
	personStayLine.material.transparent = true;
	personStayLine.material.opacity = opacity;
	personStayLine.visible = false;
	return personStayLine;
}

function animStays(obj, personStayEvents) {
	if (personStayEvents.length > 0) {
		for (let i = 0; i < personStayEvents.length; i++) {
			var tween = new TWEEN.Tween(obj.position).to({
				x: latCor(personStayEvents[i].la),
				y: (personStayEvents[i].l) / 600,
				// y: 0,
				z: lonCor(personStayEvents[i].lo)
			}, personStayEvents[i].l).start();
		}
	}
}

//Tween the selceted person
function animatePersonSelection(obj) {
	let preScale = new THREE.Vector3(3, 3, 3)
	let postScale = new THREE.Vector3(15, 15, 15);
	let tweenA = new TWEEN.Tween(obj.scale)
		.to(postScale, 50);
	let tweenBack = new TWEEN.Tween(obj.scale)
		.to(preScale, 1000);

	tweenA.chain(tweenBack).start();
}

// Raycast shows details and anim of user 
function raycastPersonDetails() {
	//set raytrecer 
	raycaster.setFromCamera(mouse, camera);
	//find interactions 
	intersections = raycaster.intersectObjects(scene.children);
	intersection = (intersections.length) > 0 ? intersections[0] : null;

	if (intersection && intersection.object.type == 'Sprite') {
		// document.body.style.cursor = 'none';
		let tDiv = document.getElementById("timeDiv");
		tDiv.innerHTML = intersection.object.name;
		animatePersonSelection(intersection.object);

		if (pplLinesGrp.visible
			&& scene.getObjectByName(intersection.object.uuid)
			&& scene.getObjectByName(intersection.object.uuid).type == 'Line') {
			scene.getObjectByName(intersection.object.uuid).visible = true;
		}
	}
}
