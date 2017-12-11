function viz(data) {

    var rncData = data.dates["2016-08-20"].hours
    var hrs = Object.keys(rncData).length;

    var container;
    var camera, scene, renderer, particles, geometry, material, i, h, color, colors = [],
        sprite, size;
    var mouseX = 0,
        mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    init();
    animate();

    function init() {
        container = document.createElement("Div");
        document.body.appendChild(container);
        camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 5000);
        camera.position.z = 1000;
        scene = new THREE.Scene();

        scene.fog = new THREE.Fog(0x041225, 1, 3000);


        UnClustered(rncData, hrs, scene);
        Clustered(rncData, hrs, scene);

        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
    }

    function onWindowResize(event) {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    //
    function animate() {
        requestAnimationFrame(animate);
        render();
    }


    // AXIS sphere
    var axes = new THREE.AxisHelper(100);
    scene.add(axes);


    controls = new THREE.OrbitControls(camera, renderer.domElement);

    function render() {
        renderer.render(scene, camera);
    }
}