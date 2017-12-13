var container;
var camera, scene, renderer, particles, geometry, material, i, h, color, colors = [],
    sprite, size;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var lineGroup;



////////////////////////////
/////////DATA from JSON/////
////////////////////////////

$(window).on("load", parseJson());
var hoursData;

function parseJson() {
    $.getJSON('data/full.json', function (data) {
        viz(data);
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
        camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 1000;
        controls = new THREE.TrackballControls(camera, renderer.domElememnt);
        controls.rotateSpeed = 1;
        controls.zoomSpeed = 1;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = false;
        controls.dynamicDampingFactor = .5;
        controls.keys = [65, 83, 68];
        controls.addEventListener('change', render);

        // AXIS sphere
        var axes = new THREE.AxisHelper(500);
        scene.add(axes);

        //fog
        scene.fog = new THREE.Fog(0x041225, 1, 5000);


        ////////////////////////////
        ////CALL DRAW METHODS///////
        ////////////////////////////
        DataToGeometry(data, scene);

        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        // document.addEventListener('mousedown', onDocumentMouseDown, false);
        // document.addEventListener('mouseup', onDocumentMouseUp, false);
    }

    function onWindowResize(event) {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        controls.update();
    }

    function render() {
        renderer.render(scene, camera);
    }
}