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
    var container;
    var camera, scene, renderer, particles, geometry, material, i, h, color, colors = [],
        sprite, size;
    init();
    animate();

    function init() {
        container = document.createElement("Div");
        document.body.appendChild(container);
        // camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);
        // camera.position.z = 300;
        // camera.position.y = 5000;
        // camera.position.x = -1000;
        // camera
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set( 0, 0, 1000);
        
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        // AXIS sphere
        var axes = new THREE.AxisHelper(500);
        scene.add(axes);
        //fog
        scene.fog = new THREE.Fog(0x041225, 1, 5000);
        // controls lib
        // controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls = new THREE.TrackballControls(camera, renderer.domElememnt);


        ////////////////////////////
        ////CALL DRAW METHODS///////
        ////////////////////////////
        DataToGeometry(data, scene);
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
    }

    function render() {
        controls.update();

        renderer.render(scene, camera);
    }
}