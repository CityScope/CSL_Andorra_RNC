////THREE SETUP VARS////////////
var container
var scene
var renderer
var controls
var camera
var axes
//
var mouseX = 0,
    mouseY = 0;
//
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

////VIZ  VARS ////////////
var conModelPosition = new THREE.Vector3;
var lineGroup
var spriteGroup
var colors = {
    spain: 0xF26101,
    andorra: 0xFFFFFF,
    france: 0x0071BC,
    background: 0x304269,
    visitors: 0xEC4269
};

////GEO LOC VARS////////////
var ul = [42.505086, 1.509961];
var ur = [42.517066, 1.544024];
var lr = [42.508161, 1.549798];
var ll = [42.496164, 1.515728];

var pul = corToPnt(ul);
var pur = corToPnt(ur);
var plr = corToPnt(lr);
var pll = corToPnt(ll);

////////////////////////////////////////////////////////////////
//////////HELPERS   FUNCTIONS/////////////////////////////////
////////////////////////////////////////////////////////////////

// converts object with lat lon to THREE vector3 
function corToPnt(cor) {
    corPnt = new THREE.Vector3(latCor(cor[0]), 0, lonCor(cor[1]));
    return corPnt;
}

// Draws lines to show extents of Andorra cropped model
function modelBounds() {
    var material = new THREE.LineBasicMaterial({
        color: 'white'
    });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        pul, pur, plr, pul
    );
    var line = new THREE.Line(geometry, material);
    scene.add(line);
}

// Returns point on line at % location 
function getPntOnLine(pointA, pointB, percentage, boolViz) {
    var dir = pointB.clone().sub(pointA);
    var len = dir.length();
    dir = dir.normalize().multiplyScalar(len * percentage);
    pntOnLine = pointA.clone().add(dir);

    if (boolViz) {
        // graphic rep
        var geometry = new THREE.SphereGeometry(10, 16, 16);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(pntOnLine.x, pntOnLine.y, pntOnLine.z);
        scene.add(sphere);
        //
        modelBounds();
    }
    return pntOnLine;
}

// converts lat to THREEjs close to axis points
function latCor(lat) {
    lat = 100 * ((100 * (lat)) - 4250);
    return lat;
}

// converts lon to THREEjs close to axis points 
function lonCor(lon) {
    lon = 100 * ((lon * 100) - 150);
    return lon;
}


////////////////////////////////////////////////////////////////
/////////DATA from JSON/////////////////////////////////////////
////////////////////////////////////////////////////////////////


/////////parser /////////////

$(window).on("load", parseJson());

function parseJson() {
    $.getJSON('data/all.json', function (data) {
        ThreeJS(data);
    })
}

/////////SETUP THREE.JS/////
function ThreeJS(data) {
    // get info div into var on start so we can toggle on/off using button 

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
        if (camera === undefined) {
            camera = new THREE.PerspectiveCamera(70, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
            camera.position.set(0, 200, 0);
        }
        controls = new THREE.OrbitControls(camera);


        //light 
        var light = new THREE.PointLight(0xF26101, .5, 10000);
        light.position.set(-500, 1000, 500)
        var light2 = new THREE.PointLight(0x0071BC, .5, 10000);
        light2.position.set(500, 1000, -500)
        scene.add(light, light2);

        ////////////////////////////
        ////AXIS GRID HELPERS///////
        ////////////////////////////
        axes = new THREE.AxisHelper(10000);
        // scene.add(axes);
        //grid helper 
        var gridHelper = new THREE.GridHelper(10000, 100, 'white', 0x4f4f4f);
        gridHelper.position.y = 0;
        gridHelper.position.x = 0;
        // scene.add(gridHelper);
        //FOG
        scene.fog = new THREE.Fog(0x01070E, 1, 3000);

        //CALL EVENTS METHODS
        window.addEventListener('resize', onWindowResize, false);

        //CALLThreeJS METHODS
        conModel(data)
        // PeopleViz(data);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        controls.update();
    }

    function render() {
        TWEEN.update();
        renderer.render(scene, camera);
    }

}

/////WINDOW RESIZE//////////
function onWindowResize(event) {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
////CAMERA ////////
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;
}