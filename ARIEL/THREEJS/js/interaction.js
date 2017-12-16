////////////////////////////
//////VARS//////////////////
////////////////////////////

let pastClicks = [];
let thisLine;

////////////////////////////
/////UI/////////////////////
////////////////////////////

function onWindowResize(event) {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// var hoursDiv = document.createElement("div");
// hoursDiv.innerHTML = "12";

function onCameraChange() {
    var proj = toScreenPosition(axes, camera);
    // console.log(proj);
    //     hoursDiv.style.left = proj.x + 'px';
    //     hoursDiv.style.top = proj.y + 'px';
}

function toScreenPosition(obj, camera) {
    var vector = new THREE.Vector3();
    var widthHalf = 0.5 * renderer.context.canvas.width;
    var heightHalf = 0.5 * renderer.context.canvas.height;
    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);
    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;
    return {
        x: vector.x,
        y: vector.y
    };
}



////////////BUTTON METHOD///////////////////
function makeButton(btnDiv, btnTxt) {
    //  Create the button
    var btn = document.createElement("button");
    btn.innerHTML = btnTxt;
    //  Append somewhere
    var body = document.getElementsByTagName(btnDiv)[0];
    body.appendChild(btn);
    //return it 
    return btn;
}

////////LINES BUTTON/////////////////////////
linesBtn = makeButton("body", "Show cluster generation")

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

//////////ANIM BUTTON/////////////////////////
animBtn = makeButton("body", "Animate IDs")
animBtn.style.top = "92%"; // locate button 

var animBtnFlag = 0;
animBtn.addEventListener("click", function () {
    if (animBtnFlag === 0) {
        animBtn.innerHTML = "Stop Animation";
        animBtnFlag = 1;
    } else {
        animBtn.innerHTML = "Start Animation";
        animBtnFlag = 0;

    }
});

////////////////////////////
/////EVENTS////////////////
////////////////////////////

function onDocumentMouseUp(event) {
    mousePressed = true;
}

function onDocumentMouseMove(event) {
    mousePressed = false;
    syncframe = 0;
}

function onDocumentMouseDown(event) {
    let div = document.getElementById('lineInfo');

    if (btnFlag === 1) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse.clone(), camera);
        let inter = raycaster.intersectObjects(lineGroup.children, true);
        // if there is interaction 
        if (inter.length > 0) {
            // for (let i = 0; i < lineGroup.children.length; i++) {
            //     lineGroups.children[i].material.color.set("black");
            // };

            thisLine = inter[0].object.clone();
            thisLine.material.color.setHSL(0.8, 1, 0.5);
            div.innerHTML = inter[0].object.name;
        }
    } else {
        div.innerHTML = null;
    }
}