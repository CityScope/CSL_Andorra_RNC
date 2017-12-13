// function onDocumentMouseDown(event) {
//     mousePressed = true;
// }

// function onDocumentMouseUp(event) {
//     mousePressed = false;
//     syncframe = 0;
// }

function onDocumentMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse.clone(), camera);
    let inter = raycaster.intersectObjects(lineGroup.children);
    if (inter.length > 0) {
        for (let i = 0; i < inter.length; i++) {
            console.log(inter[i]);
            
            inter[0].object.material.color.set("yellow");

            var div = document.getElementById('lineInfo');
            div.innerHTML = inter[i].object.name;
        }
    }
}