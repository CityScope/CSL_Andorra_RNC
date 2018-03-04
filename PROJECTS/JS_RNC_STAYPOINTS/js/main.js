////THREE SETUP VARS////////////
var container;
var scene;
var renderer;
var controls;
var camera, orthoCam;
var axes;

//
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

//DATA
var data = null;
var dataSorted = null;
var dataDate = 1475193600;
var epochDay = 86400;

////VIZ  VARS ////////////
// var StaticLnGrp, StaticPplGrp;
var pplLinesGrp = new THREE.Object3D();
//declare global
var amenGrp = new THREE.Object3D();

var colors = {
	spain: 0xF26101,
	andorra: 0xFFFFFF,
	france: 0x0071BC,
	background: 0x304269,
	visitors: 0xEC4269
};

var camLookAt = new THREE.Vector3(65, 0, 300); //center of adorra models
var requestId;

////GEO LOC VARS////////////
var ul = [42.505086, 1.509961];
var ur = [42.517066, 1.544024];
var lr = [42.508161, 1.549798];
var ll = [42.496164, 1.515728];

var pul = corToPnt(ul);
var pur = corToPnt(ur);
var plr = corToPnt(lr);
var pll = corToPnt(ll);

//////////////////////////////////////////////////////////
//////////HELPERS FUNCTIONS/////////////////////////////
/////////////////////////////////////////////////////////

// converts object with lat lon to THREE vector3
function corToPnt(cor) {
	corPnt = new THREE.Vector3(latCor(cor[0]), 0, lonCor(cor[1]));
	return corPnt;
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

// Draws lines to show extents of Andorra cropped model
function modelBounds() {
	var material = new THREE.LineBasicMaterial({
		color: "white"
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

//returns obj color by nation 
function colorByNation(nation) {
	let color = null;
	if (nation === "Spain") {
		color = colors.spain;
	} else if (nation === "France") {
		color = colors.france;
	} else if (nation === "Andorra") {
		color = colors.andorra;
	} else {
		color = colors.visitors;
	}
	return color;
}

/////WINDOW RESIZE//////////
function onWindowResize(event) {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	document.body.style.cursor = 'default';

}

document.addEventListener('mousemove', onDocumentMouseMove, false);


//////////////////////////////////////////////////////
/////////DATA from JSON//////////////////////////////
/////////////////////////////////////////////////////

/////////parser /////////////

$(window).on("load", parseJson());

function parseJson() {
	$.getJSON("data/all.json", function (data) {
		console.log("loaded page and data from json");
		function dataSort(a, b) {
			return a.S[0].s - b.S[0].s;
		}
		dataSorted = Object.values(data).sort(dataSort);
		//CALLThreeJS METHODS
		ThreeJS();
		conModel();
		animPeople(data);
	});

	//JQ method get 
	// $.get("data/amen.csv", function (d) {
	// 	console.log("loaded csv");
	// 	drawAmenities(csvToamenArr(d));
	// }, "text");
}


/////////SETUP THREE.JS/////
function ThreeJS() {
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
			camera.position.set(100, 100, 0);
		}

		//SUPER IMPORTANT: renderer.domElement solves DAT.GUI 
		// issue with drop downmenu not reposniding 
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.target.set(65, 0, 300); //center of andorra models

		//light 
		var light = new THREE.PointLight(0xF26101, .5, 10000);
		light.position.set(-500, 1000, 500);
		var light2 = new THREE.PointLight(0x0071BC, .5, 10000);
		light2.position.set(500, 1000, -500);
		scene.add(light, light2);

		////////////////////////////
		////AXIS GRID HELPERS///////
		////////////////////////////
		axes = new THREE.AxisHelper(10000);
		// scene.add(axes);
		//grid helper 

		for (let t = 0; t < 24; t++) {
			var gridHelper = new THREE.GridHelper(10000, 2, "white", colors.background);
			gridHelper.position.y = t * 60;
			gridHelper.position.x = 0;
			// scene.add(gridHelper);
		}

		//FOG
		scene.fog = new THREE.Fog(0x01070E, 1, 7000);

		//CALL EVENTS METHODS
		window.addEventListener("resize", onWindowResize, false);
		// camSpin();
		topCam();
	}

	function animate() {
		render();
		controls.update();
		TWEEN.update();
		requestAnimationFrame(animate);
	}

	function render() {
		//raycast
		raycastPersonDetails();
		renderer.render(scene, camera);
	}
}

var camSpinBool;
//camera spin
function camSpin() {
	camera.fov = 70;
	controls.enabled = false;
	timer = Date.now() * params.rotSpeed;
	camera.position.x = camLookAt.x + Math.sin(timer) * 200;
	camera.position.y = 100;
	camera.position.z = camLookAt.z + Math.cos(timer) * 200;
	camera.lookAt(camLookAt); //center of adorra models
	camera.updateProjectionMatrix();
	camSpinBool = requestAnimationFrame(camSpin);
}

function cancelSpin() {
	camSpinBool = cancelAnimationFrame(camSpinBool);
	controls.enabled = true;
}

function topCam() {
	camera.rotation.order = "YXZ";
	camSpinBool = cancelAnimationFrame(camSpinBool);
	camera.position.x = camLookAt.x;
	camera.position.z = camLookAt.z;
	camera.position.y = 3000;
	camera.fov = 5;
	camera.lookAt(camLookAt); //center of adorra models
	let rotAng = Math.atan2(pul.z - pur.z, pul.x - pur.x);
	camera.updateProjectionMatrix();
	controls.enabled = true;
	controls.object.rotation.x = (rotAng);
	controls.update()
}
