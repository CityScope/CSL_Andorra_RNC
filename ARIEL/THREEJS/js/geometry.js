function DataToGeometry(data, scene) {
    var rncData = data.dates["2016-08-20"].hours
    var hrs = Object.keys(rncData).length;
    UnClustered(rncData, hrs, scene);
    Clustered(rncData, hrs, scene);
}
////////////////////////////
/////////UNC////////////////
////////////////////////////
function UnClustered(rncData, hrs, scene) {
    var pntTxt = new THREE.TextureLoader().load("img/lf3.png");
    var pntGeo = new THREE.Geometry();

    for (let h = 0; h < hrs; h++) {
        let unc = rncData[h].unC;
        for (let i = 0; i < rncData[h].unC.lat.length; i++) {
            let p = new THREE.Vector3();
            p.x = 100 * ((100 * (unc.lat[i])) - 4250);
            p.z = 100 * ((unc.lon[i] * 100) - 150);
            p.y = h * 100;
            pntGeo.vertices.push(p);
        }
        pntMaterial = new THREE.PointsMaterial({
            size: 2,
            map: pntTxt,
            alphaTest: 0.5,
            blending: THREE.AdditiveBlending,
            color: "grey"

        });
        // pntMaterial.color.setHSL((h / 24), 1, .5);
        var geometry = new THREE.Points(pntGeo, pntMaterial)
    }
    scene.add(geometry);
}
////////////////////////////
/////////Clustered//////////
////////////////////////////
function Clustered(rncData, hrs, scene) {
    var spriteGroup;
    spriteGroup = new THREE.Object3D();
    var linesData = [];
    var particleTexture = new THREE.TextureLoader().load("img/lf.png");

    for (let h = 0; h < hrs; h++) {
        let c = rncData[h].C;
        var nationInter = Math.max(...c.nation) - Math.min(...c.nation);
        for (let i = 0; i < rncData[h].C.personId.length; i++) {
            //
            let p = new THREE.Vector3();
            p.x = 100 * ((100 * (c.lat[i])) - 4250);
            p.z = 100 * ((c.lon[i] * 100) - 150);
            p.y = h * 100;
            //
            var sprite = new THREE.Sprite(spriteMaterial);
            // sprite.name(rncData[h].C.nation[i]);
            sprite.scale.set(10, 10, 1); // imageWidth, imageHeight
            sprite.position.set(p.x, p.y, p.z);
            //material
            var spriteMaterial = new THREE.SpriteMaterial({
                map: particleTexture
                // alphaTest: 0.5
            });
            sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
            // sprite.material.color.setHSL(((h / 24) * 0.4) + 0.5, 1, .5);
            sprite.material.color.setHSL(0.8, 1, 0.5);

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
function makeLines(linesData, scene) {
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
                geometry.vertices.push(new THREE.Vector3(value[i].lat, value[i].hr * 100, value[i].lon));
            }
            var material = new THREE.LineBasicMaterial({
                color: color,
                // blending: THREE.AdditiveBlending
            });
            var line = new THREE.Line(geometry, material);
            line.material.color.setHSL(((value.length / 12) * 0.4) + 0.5, 1, .5);
            line.name = "User ID: " + index + " from: " + nation + " stayed in a cluster for: " + value.length + " hours";
            lineGroup.add(line)
        }
    });
    scene.add(lineGroup);
}