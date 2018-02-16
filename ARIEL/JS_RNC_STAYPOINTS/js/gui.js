var stopSpinBool = true;

// dat.GUI
var gui = new dat.GUI({
    width: 300
});

var params = {
    animCamBool: false,
    rotSpeed: 0.0001,
    lines: true,
    nation: 'All'
};

gui.add(params, "animCamBool").onChange(function () {
    stopSpinBool = !stopSpinBool;
    camSpin();
});
gui.add(params, 'rotSpeed', 0, 0.0010);

//Lines
gui.add(params, "lines").onChange(function (bool) {
    if (lineGroup != null) {
        lineGroup.visible = bool;
    }
});

gui.add(params, 'nation', ['All', 'FR', 'SP', 'Others']);

function camSpin() {
    controls.enabled = false;
    timer = Date.now() * params.rotSpeed;
    camera.position.x = camLookAt.x + Math.sin(timer) * 300;
    camera.position.z = camLookAt.z + Math.cos(timer) * 300;
    camera.lookAt(camLookAt); //center of adorra model s


    if (stopSpinBool) {
        controls.enabled = true;
        return;
    }
    requestId = requestAnimationFrame(camSpin);
}