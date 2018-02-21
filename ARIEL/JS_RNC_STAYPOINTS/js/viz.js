/////////PEOPLE VIZ////////
function StaticPplViz(data) {
	console.log("Visulaizing stays");
	//data vars
	var keys = Object.keys(data);
	var len = keys.length;
	var key;
	var value;
	// sprite vars
	StaticPplGrp = new THREE.Object3D();
	var particleTexture = new THREE.TextureLoader().load("img/lf3.png");

	//line vars
	StaticLnGrp = new THREE.Object3D();
	let color = new THREE.Color();
	var geometry;

	for (let i = 0; i < keys.length; i++) {
		geometry = new THREE.Geometry();
		key = keys[i];
		value = data[key];
		//remove andorrans
		if (value.N != "Andorra") {
			//se - stay events 
			for (let se = 0; se < Object.keys(value.S).length; se++) {
				let p = new THREE.Vector3();
				p.x = latCor(value.S[se].la);
				p.z = lonCor(value.S[se].lo);
				p.y = (value.S[se].s - dataDate) / 60; //start time for stay event as Y axis 

				//Sprites
				var sprite = new THREE.Sprite(spriteMaterial);
				sprite.scale.set(4, 4, 4); // imageWidth, imageHeight
				sprite.position.set(p.x, p.y, p.z);
				sprite.name = value.S[se].s + "," + value.S[se].l + "," + key;
				//material
				var spriteMaterial = new THREE.SpriteMaterial({
					map: particleTexture,
					transparent: true
				});
				sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
				sprite.material.color.setHex(colorByNation(value.N));

				//add to group of sprites 
				sprite.name = value.N;
				StaticPplGrp.add(sprite);

				/////////LINES//////////////
				geometry.vertices.push(new THREE.Vector3(p.x, p.y, p.z));
				geometry.vertices.push(new THREE.Vector3(p.x, p.y + value.S[se].l / 60, p.z));
			}
			var material = new THREE.LineBasicMaterial({
				color: color,
			});
			var line = new THREE.Line(geometry, material);
			line.material.color = sprite.material.color;
			line.name = value.N;
		}
		if (line instanceof THREE.Object3D) { // fix non THREE elements 
			StaticLnGrp.add(line);
		}
	}
	scene.add(StaticPplGrp);
	scene.add(StaticLnGrp);
	//hide the groups for GUI
	StaticLnGrp.visible = false;
	StaticPplGrp.visible = false;
}