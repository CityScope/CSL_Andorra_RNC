// dat.GUI
var gui = new dat.GUI({
	width: 300
});
var params = {
	animCamBool: true,
	rotSpeed: 0.0001,
	paths: false,
	nation: "All"
};
gui.add(params, "animCamBool").name("Rotate Camera").onChange(function () {
	stopSpinBool = !stopSpinBool;
	camSpin();
});
gui.add(params, "rotSpeed", 0, 0.0010).name("Rotation Speed");
//paths
gui.add(params, "paths").name("Static Users").onChange(function (bool) {
	if (StaticLnGrp != null) {
		StaticLnGrp.visible = bool;
		StaticPplGrp.visible = bool;
	}
});
// gui.add(params, 'nation', ['All', 'FR', 'SP', 'Others']);