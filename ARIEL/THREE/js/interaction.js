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
/////EVENTS/////////////////
////////////////////////////

function onDocumentMouseUp(event) {
    mousePressed = true;
}

function onDocumentMouseMove(event) {
    mousePressed = false;
    syncframe = 0;
}

//counter
let clickedArray = [];

function onDocumentMouseDown(event) {
    let div = document.getElementById('lineInfo');
    if (btnFlag === 1) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse.clone(), camera);
        let inter = raycaster.intersectObjects(lineGroup.children, true);

        // if there is interaction 
        if (inter.length > 0 && clickedArray.includes(inter[0].object.uuid) === false) {
            clickedArray.push(inter[0].object.uuid);
            curve = new THREE.CatmullRomCurve3(inter[0].object.geometry.vertices, 0);
            tubeGeometry = new THREE.TubeGeometry(curve, 100,1 , inter[0].object.geometry.vertices.length, false)
            tubeMaterial = new THREE.MeshBasicMaterial({
                color: inter[0].object.material.color,
                transparent: true,
                opacity: 0.5
            });
            tubeMaterial.blending = THREE.AdditiveBlending;
            tubeLine = new THREE.Mesh(tubeGeometry, tubeMaterial)
            scene.add(tubeLine);

            // text into div 
            div.innerHTML = inter[0].object.name;
        }
    } else {
        div.innerHTML = null;
    }
}

////////////////////////////
/////WINDOW RESIZE//////////
////////////////////////////

function onWindowResize(event) {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}