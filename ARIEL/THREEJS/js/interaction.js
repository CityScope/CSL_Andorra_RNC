function onDocumentMouseUp(event) {
    mousePressed = true;
}

function onDocumentMouseMove(event) {
    mousePressed = false;
    syncframe = 0;
}

let pastClicks = [];
let thisLine;


function onDocumentMouseDown(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse.clone(), camera);
    raycaster.linePrecision = 1;
    let inter = raycaster.intersectObjects(lineGroup.children, true);
    // if there is interaction 
    if (inter.length > 0) {
        thisLine = inter[0].object.clone();
        thisLine.material.color.set("yellow");
        var div = document.getElementById('lineInfo');
        div.innerHTML = inter[0].object.name;
        thisLine.visible = true;
    }
}