//materials 
// #F26101 spain
// #FFFFFF andorra 
// #91BED4 // extra
// #0071BC france 
// #304269 b/g
// #EC4269 visitors 

function DataToGeometry(data, scene) {
    var rncData = data.dates["2016-08-20"].hours // to be fixed 
    var hrs = Object.keys(rncData).length;
    UnClustered(rncData, hrs, scene);
    Clustered(rncData, hrs, scene);
}


////////////////////////////
/////////UNC////////////////
////////////////////////////
function UnClustered(rncData, hrs) {

    ////////////////////////////
    /// POINT///////////////////
    ////////////////////////////

    var pntTexture = new THREE.TextureLoader().load("img/lf3.png");
    var pnt = new THREE.Geometry();
    pntMaterial = new THREE.PointsMaterial({
        size: 1,
        map: pntTexture,
        alphaTest: 0.5,
        // blending: THREE.AdditiveBlending,
        color: "white"
    });
    // pntMaterial.color.setHSL((h / 24), 1, .5);

    for (let h = 0; h < hrs; h++) {
        let unc = rncData[h].unC;
        for (let i = 0; i < rncData[h].unC.lat.length; i++) {
            let p = new THREE.Vector3();
            p.x = 100 * ((100 * (unc.lat[i])) - 4250);
            p.z = 100 * ((unc.lon[i] * 100) - 150);
            p.y = h * 50;
            pnt.vertices.push(p);
        }
        pntGroup = new THREE.Points(pnt, pntMaterial)
    }
    scene.add(pntGroup);
}

////////////////////////////
/////////Clustered//////////
////////////////////////////
function Clustered(rncData, hrs) {

    spriteGroup = new THREE.Object3D();
    var linesData = [];
    var particleTexture = new THREE.TextureLoader().load("img/lf3.png");

    for (let h = 0; h < hrs; h++) {
        let c = rncData[h].C;

        for (let i = 0; i < c.personId.length; i++) {
            //
            let p = new THREE.Vector3();
            p.x = 100 * ((100 * (c.lat[i])) - 4250);
            p.z = 100 * ((c.lon[i] * 100) - 150);
            p.y = h * 50;
            //
            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(1, 1, 1); // imageWidth, imageHeight
            sprite.position.set(p.x, p.y, p.z);
            sprite.name = c.personId[i]
            //material
            var spriteMaterial = new THREE.SpriteMaterial({
                map: particleTexture,
                transparent: true
            });
            sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles

            if (c.nation[i] === 208) {
                sprite.material.color.setHex(0xF26101)

            } else if (c.nation[i] === 214) {
                sprite.material.color.setHex(0x0071BC)

            } else if (c.nation[i] === 213) {
                sprite.material.color.setStyle("rgb(255, 255, 255)")
                sprite.material.opacity = 0.25;
            } else {
                sprite.material.color.setHex(0xEC4269)
            }

            // sprite.material.color.setHSL(((h / 24) * 0.4) + 0.5, 1, .5); // grad color by hour
            spriteGroup.add(sprite);
            ////////////////////////
            //add data to linedata array
            ////////////////////////
            linesData.push({
                id: c.personId[i],
                lat: p.x,
                lon: p.z,
                nat: c.nation[i],
                hr: h
            });
        }
    }
    makeLines(linesData, scene);
    scene.add(spriteGroup);
}

////////////////////////////
/////////LINES//////////////
////////////////////////////
function makeLines(linesData) {
    //groups all same people together so lines could be constructed 
    const grpById = _.groupBy(linesData, function (d) {
        return d.id;
    });

    //make lines
    lineGroup = new THREE.Object3D();
    let color = new THREE.Color();
    let nation;
    color.setHSL(5, 1, 0);
    $.each(grpById, function (index, value) {
        if (value.length > 1) { // if person was in more than one cluster over time
            nation = value[0].nat;
            var geometry = new THREE.Geometry();
            for (let i = 0; i < value.length; i++) {
                geometry.vertices.push(new THREE.Vector3(value[i].lat, value[i].hr * 50, value[i].lon));
            }
            var material = new THREE.LineBasicMaterial({
                color: color,
                // blending: THREE.AdditiveBlending
            });
            var line = new THREE.Line(geometry, material);

            // line.material.color.setHSL(.56, 1, (value.length / 12) * 0.5);

            if (nation === 208) {
                line.material.color.setHex(0xF26101)
                line.name = "User ID: " + index + " from Spain" + "<br>" + " stayed in a cluster for " + value.length + " hours";
            } else if (nation === 214) {
                line.material.color.setHex(0x0071BC)
                line.name = "User ID: " + index + " from France" + "<br>" + " stayed in a cluster for " + value.length + " hours";
            } else if (nation === 213) {
                line.material.color.setHSL(0,0,.5)
                line.name = "User ID: " + index + " from Andorra" + "<br>" + " stayed in a cluster for " + value.length + " hours";
            } else {
                line.material.color.setHex(0xEC4269)
                line.name = "User ID: " + index + " from: " + nation + "<br>" + " stayed in a cluster for " + value.length + " hours";

            }

            lineGroup.add(line)
        }
    });
}

////////////////////////////
///HOURS INDICATOR/////////
////////////////////////////
function HoursText() {
    // hrsTextHolder geomtry
    for (let h = 0; h < 24; h++) {
        // //make all 24 divs 
        hoursDiv = document.createElement('div');
        hoursDiv.setAttribute("id", "hoursDiv");
        document.body.appendChild(hoursDiv);
        hoursDiv.style.position = "absolute";
        allhoursDiv.push(hoursDiv)

        // // make text cube ref. points 
        cube = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({
            color: 0x00ff00
        }));
        cube.position.x = 0;
        cube.position.y = (h * 50) + 5;
        cube.position.z = 100;
        hrsTextHolder.add(cube);
    }
}

//listen to camera move for each text object
function onCameraChange() {
    for (let h = 0; h < allhoursDiv.length; h++) {
        var proj = toScreenPosition(hrsTextHolder.children[h], camera);
        allhoursDiv[h].style.left = proj.x + 'px';
        allhoursDiv[h].style.top = proj.y + 'px';
        allhoursDiv[h].innerHTML = "hour " + h;
    }
}

//returns location on screen
function toScreenPosition(obj, camera) {
    var vector = new THREE.Vector3();
    var widthHalf = 0.25 * renderer.context.canvas.width;
    var heightHalf = 0.25 * renderer.context.canvas.height;
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

