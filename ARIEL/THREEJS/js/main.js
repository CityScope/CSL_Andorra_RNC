var container;
var scene, renderer, particles, geometry, material, i, h, color,
    sprite, size, controls;
var camera, camX, camZ;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var lineGroup, pntGroup;

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
        controls.addEventListener('change', render);

        //cam pos 
        camX = 300;
        camZ = -100;
        camera.position.set(camX, 1000, camZ);
        controls.target = new THREE.Vector3(-100, 1000, 500); //look at bypass on trackball 

        camera.up = new THREE.Vector3(0, 1, 0);

        // AXIS sphere
        var axes = new THREE.AxisHelper(100);
        scene.add(axes);
        //grid helper 
        var gridHelper = new THREE.GridHelper(10000, 100, 'white', 0x4f4f4f);
        gridHelper.position.y = 0;
        gridHelper.position.x = 0;
        scene.add(gridHelper);

        //fog
        scene.fog = new THREE.Fog(0x041225, 0, 3000);


        ////////////////////////////
        ////CALL DRAW METHODS///////
        ////////////////////////////
        DataToGeometry(data, scene);

        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);
    }

    function onWindowResize(event) {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      
        if (animBtnFlag === 1) {
            pntGroup.geometry.vertices.forEach(function (m) {
                m.z += 0.5 * Math.random() * Math.sin(Date.now());
                m.x += 0.5 * Math.random() * Math.sin(Date.now());
            });
            pntGroup.geometry.verticesNeedUpdate = true;
        } else {
            pntGroup.geometry.verticesNeedUpdate = false;
        }

        requestAnimationFrame(animate);
        render();
        controls.update();
        // requestAnimationFrame(animate);
    }

    function render() {
        renderer.render(scene, camera);
    }
}