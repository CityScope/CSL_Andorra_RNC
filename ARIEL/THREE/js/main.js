////////////////////////////
////GLOBAL VARS ////////////
////////////////////////////
var container
var scene
var renderer
var controls
var camera
var camX
var camZ
var mouse = new THREE.Vector2()
var raycaster = new THREE.Raycaster()
var lineGroup
var pntGroup
var spriteGroup
var hoursData
var axes
var pastClicks = []
var thisLine

var hoursDiv
var allhoursDiv = []
var hrsTextHolder = new THREE.Group()
var cube


////////////////////////////
/////////DATA from JSON/////
////////////////////////////
$(window).on("load", parseJson());

prgsDiv = document.createElement('div');
prgsDiv.setAttribute("id", "prgsDiv");
document.body.appendChild(prgsDiv);


function parseJson() {
    $.getJSON('data/full.json', function (data) {
        viz(data);
    }).progress(function (dl) {
        if (dl.loaded < dl.total) {
            prgsPer = Math.floor(100 * (dl.loaded / dl.total)) + '%'
            prgsDiv.innerHTML = prgsPer;
        } else {
            prgsDiv.innerHTML = null;
            // document.getElementById("prgsDiv").remove();
        }
    })
}

////////////////////////////
/////////SETUP THREE.JS/////
////////////////////////////
function viz(data) {
    init();
    animate();

    function init() {
        container = document.createElement("Div");
        document.body.appendChild(container);
        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        // camera
        camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
        controls = new THREE.TrackballControls(camera, renderer.domElememnt);
        controls.rotateSpeed = 1;
        controls.zoomSpeed = 1;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = false;
        controls.dynamicDampingFactor = .3;
        controls.keys = [65, 83, 68];

        controls.addEventListener('change', function () {
            render();
            onCameraChange(); //calls update for hours text locations  
        });
        //cam pos 
        camera.position.set(73, 860, 170);
        controls.target = new THREE.Vector3(85, 850, 350); //look at bypass on trackball 
        camera.up = new THREE.Vector3(0, 1, 0);
        
        
        // AXIS 
        axes = new THREE.AxisHelper(100);
        // scene.add(axes);

        //grid helper 
        var gridHelper = new THREE.GridHelper(10000, 100, 'white', 0x4f4f4f);
        gridHelper.position.y = 0;
        gridHelper.position.x = 0;
        // scene.add(gridHelper);
        //fog
        scene.fog = new THREE.Fog(0x01070E, 100, 1200);

        ////////////////////////////
        ////CALL DRAW METHODS///////
        ////////////////////////////
        DataToGeometry(data, scene);
        HoursText();



        ////////////////////////////
        ////CALL EVENTS METHODS/////
        ////////////////////////////

        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);
    }

    function animate() {
        spriteBeforeScale = spriteGroup.children.scale;
        if (animBtnFlag === 0) {
            spriteGroup.children.forEach(function (m) {
                Math.random()
                let sinDate = Math.sin(Date.now() * 0.001);
                let s = sinDate;
                // m.position.z += 0.1 * math; //for UNC animation 
                // m.position.x -= 0.1 * math;
                m.scale.x = s;
                m.scale.y = s;
                m.scale.z = s;
                spriteGroup.childrenNeedUpdate = true;

            });
        } else {
            spriteGroup.childrenNeedUpdate = false;
        }
        requestAnimationFrame(animate);
        render();
        controls.update();
    }

    function render() {
        renderer.render(scene, camera);
    }
}