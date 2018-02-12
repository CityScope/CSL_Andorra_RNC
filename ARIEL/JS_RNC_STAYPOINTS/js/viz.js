////CONTEXT MODEL/////////////
function conModel(data) {

    console.log("Loading Model")

    var prgsDiv = document.createElement('div');
    prgsDiv.setAttribute("id", "prgsDiv");
    document.body.appendChild(prgsDiv);

    var loader = new THREE.ObjectLoader();
    loader.load(
        // resource URL
        'model/Andorra.json',
        // called when resource is loaded
        function (object) {
            object.scale.set(120, 120, 120)
            object.position.set(0, 0, 0)
            object.position.add(getPntOnLine(pul, plr, 0.5, false))
            let rotAng = Math.atan2(pul.z - pur.z, pul.x - pur.x);
            console.log(rotAng)
            object.rotation.y = -rotAng;
            scene.add(object);
            conModelPosition.copy(object.position); //for camera rotation around object 
            camera.lookAt(conModelPosition);
        },
        // called when loading is in progresses
        function (xhr) {
            percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
            if (Math.round(percentComplete, 2) < 99) {
                prgsDiv.innerHTML = Math.round(percentComplete, 2) + '%'
            } else {
                prgsDiv.innerHTML = null;
            }
            if (percentComplete >= 100) {
                console.log("Calling PPL VIZ")

                PeopleViz(data);
            }
        },
        // called when loading has errors
        function (error) {
            console.log('An error happened');
        }
    );
}


/////////PEOPLE VIZ////////
function PeopleViz(data) {

    console.log("Visulaizing stays")

    //data vars
    var keys = Object.keys(data);
    var len = keys.length;
    var key;
    var value;

    // sprite vars
    spriteGroup = new THREE.Object3D();
    var linesData = [];
    var particleTexture = new THREE.TextureLoader().load("img/lf3.png");

    //line vars
    lineGroup = new THREE.Object3D();
    let color = new THREE.Color();
    var geometry;

    for (let i = 0; i < keys.length; i++) {
        geometry = new THREE.Geometry();
        key = keys[i];
        value = data[key];
        //remove andorrans
        if (value.N != "Andorra") {
            //se - stay events 
            for (let se = 0; se < Object.keys(value.S).length; se++) {
                let p = new THREE.Vector3();
                p.x = latCor(value.S[se].la);
                p.z = lonCor(value.S[se].lo);
                p.y = (value.S[se].s - 1475193600) / 60; //start time for stay event as Y axis 

                //Sprites
                var sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(3, 3, 3); // imageWidth, imageHeight
                sprite.position.set(p.x, p.y, p.z);
                sprite.name = value.S[se].s + "," + value.S[se].l + "," + key
                //material
                var spriteMaterial = new THREE.SpriteMaterial({
                    map: particleTexture,
                    transparent: true
                });
                sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles

                if (value.N === "Spain") {
                    sprite.material.color.setHex(colors.spain)
                } else if (value.N === "France") {
                    sprite.material.color.setHex(colors.france)
                } else if (value.N === "Andorra") {
                    sprite.material.color.setHex(colors.andorra)
                    sprite.scale.set(1, 1, 1); // imageWidth, imageHeight
                } else {
                    sprite.material.color.setHex(colors.visitors)
                }
                //add to group of sprites 
                spriteGroup.add(sprite);

                /////////LINES//////////////
                geometry.vertices.push(new THREE.Vector3(p.x, p.y, p.z));
                geometry.vertices.push(new THREE.Vector3(p.x, p.y + value.S[se].l / 60, p.z));
            }
            var material = new THREE.LineBasicMaterial({
                color: color,
            });
            var line = new THREE.Line(geometry, material);
            line.material.color = sprite.material.color;
        }
        lineGroup.add(line)
    }
    scene.add(spriteGroup);
    scene.add(lineGroup);
    // animPeople();
}

/////////MOVE AGENTS////////
function animPeople() {
    function sortY(a, b) {
        return a.geometry.vertices[0].y - b.geometry.vertices[0].y;
    }
    linesSortedByY = lineGroup.children.sort(sortY);

    for (let i = 0; i < linesSortedByY.length; i++) {
        let p = linesSortedByY[i].geometry.vertices[0];
        var geometry = new THREE.BoxGeometry(10, 10, 10);
        var material = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(p.x, p.y, p.z);
        scene.add(cube)
        for (let ver = 0; ver < linesSortedByY[i].geometry.vertices.length; ver++) {
            var tween = new TWEEN.Tween(cube.position).to({
                x: linesSortedByY[i].geometry.vertices[ver].x,
                y: linesSortedByY[i].geometry.vertices[ver].y,
                z: linesSortedByY[i].geometry.vertices[ver].z
            }, 1000).start();
        }
    }
}