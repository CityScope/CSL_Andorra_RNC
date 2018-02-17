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
	clonedData = JSON.parse(JSON.stringify(data)) // clone the original data obj
	clonedData = nest(clonedData, ['S[0].s']);

	var pplGrp = new THREE.Object3D();
	var pplTexture = new THREE.TextureLoader().load("img/lf4.png");



	for (let i = dataDate; i < dataDate + epochDay; i++) {
		let stZero = Object.values(clonedData)[0][0].S[0].s;	//gets the stats time of the first object in a group of people with the same start time 

		if (clonedData[0][0].S[0].s = i) {
			let p = clonedData[0];
			console.log(p);

			var spriteMaterial = new THREE.SpriteMaterial({
				map: pplTexture,
				transparent: true
			});
			var pplSprite = new THREE.Sprite(spriteMaterial);
			pplSprite.material.color.setHex(colorByNation(clonedData[0].N));
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
			anim(pplSprite, clonedData[0].S);
			clonedData.splice(0, 1);
			scene.add(pplSprite);
		}
	}
}

function anim(obj, stayEvent) {
	for (let e = 0; e < Object.keys(stayEvent).length; e++) {
		var tween = new TWEEN.Tween(obj.position).to({
			x: latCor(stayEvent[e].la),
			// y: (stayEvent[e].l + stayEvent[e].s) / 60,
			y: 0,
			z: lonCor(stayEvent[e].lo)
		}, stayEvent[e].l).start();
	}
}