function onDocumentMouseUp(event) {
    mousePressed = true;
}

function onDocumentMouseMove(event) {
    mousePressed = false;
    syncframe = 0;
}

let pastClicks = [];
let thisLine;



//  Create the button
var linesBtn = document.createElement("button");
linesBtn.innerHTML = "Show cluster generation";

//  Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(linesBtn);

// Add event handler
let btnFlag = 0;
linesBtn.addEventListener("click", function () {
    if (btnFlag === 0) {
        scene.add(lineGroup);
        btnFlag = 1;
        linesBtn.innerHTML = "Hide cluster generation";
    } else {
        linesBtn.innerHTML = "Show cluster generation";
        scene.remove(lineGroup);
        btnFlag = 0;
    }
});

function onDocumentMouseDown(event) {
    let div = document.getElementById('lineInfo');

    if (btnFlag === 1) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse.clone(), camera);
        raycaster.linePrecision = 1;
        let inter = raycaster.intersectObjects(lineGroup.children, true);
        // if there is interaction 
        if (inter.length > 0) {
            thisLine = inter[0].object.clone();
            thisLine.material.color.set("yellow");
            div.innerHTML = inter[0].object.name;
        }
    } else {
        div.innerHTML = null;
    }
}