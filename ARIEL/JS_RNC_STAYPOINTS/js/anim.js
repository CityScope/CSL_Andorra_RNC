/////////MOVE AGENTS////////
// function animPeople(data) {
// 	var i = 0;
// 	var pplGrp = new THREE.Object3D();
// 	var pplTexture = new THREE.TextureLoader().load("img/lf4.png");
// 	spwanStays();

// 	function spwanStays() {
// 		let p = data[i].S;
// 		var spriteMaterial = new THREE.SpriteMaterial({
// 			map: pplTexture,
// 			transparent: true
// 		});
// 		var pplSprite = new THREE.Sprite(spriteMaterial);
// 		pplSprite.material.color.setHex(colorByNation(data[i].N));
// 		pplSprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
// 		pplSprite.position.set(latCor(p[0].la), (p[0].s - dataDate) / 60, lonCor(p[0].lo));
// 		if (data[i].N != "Andorra") {
// 			pplSprite.scale.set(7, 7, 7); // imageWidth, imageHeight
// 		} else {
// 			pplSprite.scale.set(1, 1, 1); // imageWidth, imageHeight
// 		}

// 		pplGrp.add(pplSprite);

// 		anim(pplSprite, data[i].S);
// 		if (i++ < data.length) {
// 			setTimeout(spwanStays, (p[0].s - dataDate) / 1000); //wrong  -- this should be from alst point 
// 		}
// 	}
// 	scene.add(pplGrp);
// }

function animPeople(data) {

	// uses lodash `mapValues` and `groupBy`
	var nest = function (seq, keys) {
		if (!keys.length)
			return seq;
		var first = keys[0];
		var rest = keys.slice(1);
		return _.mapValues(_.groupBy(seq, first), function (value) {
			return nest(value, rest)
		});
	};

	//data managmemnt 
	/////////////////////////////////////////////////
	// clone the original data obj and sort 
	// into a group of 
	// people with the same start time 
	clonedData = nest(data, ['S[0].s'])

	//THREE static vars 
	var pplGrp = new THREE.Object3D();
	var pplTexture = new THREE.TextureLoader().load("img/lf4.png");

	//connter 
	let j = 0;

	// go through each epoch sec in a day //epochDay 
	for (let i = dataDate; i < dataDate + 10; i++) {
		//the start time of the first object in the group 
		let st = Object.values(clonedData)[j][0].S[0].s;
		// if this time is also the start time for a group of people's stay 
		// AND counter is smaller than cloneData array 
		if (st = i && j <= Object.values(clonedData).length) {
			let grp = Object.values(clonedData)[j];

			console.log(grp, i);
			for (let person = 0; person < grp.length; person++) {


				var spriteMaterial = new THREE.SpriteMaterial({
					map: pplTexture,
					transparent: true
				});
				var pplSprite = new THREE.Sprite(spriteMaterial);

				pplSprite.material.color.setHex(colorByNation(grp[person][0].N));
				pplSprite.material.blending = THREE.AdditiveBlending;
				pplSprite.position.set(latCor(p[0].la),
					// (p[0].s - dataDate) / 60,
					0,
					lonCor(p[0].lo));
				if (clonedData[0].N != "Andorra") {
					pplSprite.scale.set(5, 5, 5);
				} else {
					pplSprite.scale.set(1, 1, 1);
				}
				animateThisStay(pplSprite, clonedData[0].S);
				scene.add(pplSprite);
			}
			// setp forward the array 
			j = j + 1;
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