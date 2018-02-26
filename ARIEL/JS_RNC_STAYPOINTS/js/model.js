////CONTEXT MODEL/////////////
function conModel() {

    console.log("Loading Model")
    var prgsDiv = document.createElement('div');
    prgsDiv.setAttribute("id", "prgsDiv");
    document.body.appendChild(prgsDiv);

    var loader = new THREE.ObjectLoader();
    loader.load(
        // resource URL
        'model/Andorra.json',
        // called when resource is loaded
        function (andorraModel) {
            andorraModel.scale.set(120, 120, 120)
            andorraModel.position.set(0, 0, 0)
            andorraModel.position.add(getPntOnLine(pul, plr, 0.5, false))
            let rotAng = Math.atan2(pul.z - pur.z, pul.x - pur.x);
            andorraModel.rotation.y = -rotAng;
            scene.add(andorraModel);
            //
            console.log("Model loading is done")
        },
        // called when loading is in progresses
        function (xhr) {
            if (xhr.loaded !== xhr.total) {
                prgsDiv.innerHTML = "Loading... "
            } else {
                prgsDiv.innerHTML = null;
            }
        },
        // called when loading has errors
        function (error) {
            console.log('loading model error happened');
        }
    );
}