// dat.GUI
var gui = new dat.GUI({
	width: 300
});
var params = {
	animCamBool: true,
	camBool: true,
	rotSpeed: 0.0001,
	paths: false,
	nation: "All"
};
gui.add(params, "animCamBool").name("Rotate Camera").onChange(function () {
	stopSpinBool = !stopSpinBool;
	camSpin();
});

// gui.add(params, "camBool").name("Active Camera").onChange(function () {
// 	scene.activeCamera = (camBool ? orthoCam : camera);
// 	console.log(scene.activeCamera);
// });

gui.add(params, "rotSpeed", 0, 0.0010).name("Rotation Speed");
//paths
gui.add(params, "paths").name("Users paths").onChange(function (bool) {
	if (pplLinesGrp != null) {
		// StaticLnGrp.visible = bool;
		// StaticPplGrp.visible = bool;
		pplLinesGrp.visible = bool;
		// clear path shown on last session 
		if (bool) {
			for (var i = pplLinesGrp.children.length - 1; i >= 0; i--) {
				pplLinesGrp.children[i].visible = false;
			}
		}
	}
});



// gui.add(params, 'nation', ['All', 'FR', 'SP', 'Others']);