function DataToGeometry(data, scene) {
    var rncData = data.dates["2016-08-20"].hours
    var hrs = Object.keys(rncData).length;
    // UnClustered(rncData, hrs, scene);
    Clustered(rncData, hrs, scene);
}

////////////////////////////
/////////UNC////////////////
////////////////////////////
function UnClustered(rncData, hrs, scene) {
    var pntGeo = new THREE.Geometry();
    for (let h = 0; h < hrs; h++) {
        let unc = rncData[h].unC;
        if (rncData[h].unC.lat.length > 0) {
            for (let i = 0; i < rncData[h].unC.lat.length; i++) {
                let p = new THREE.Vector3();
                p.x = 100 * ((100 * (unc.lat[i])) - 4250);
                p.z = 100 * ((unc.lon[i] * 100) - 150);
                p.y = h * 100;
                pntGeo.vertices.push(p);
            }
        }
    }
    var pntMaterial = new THREE.PointsMaterial({
        size: 0.5,
        color: 'white'
    });
    var geometry = new THREE.Points(pntGeo, pntMaterial)
    scene.add(geometry);
}

////////////////////////////
/////////Clustered//////////
////////////////////////////
function Clustered(rncData, hrs, scene) {
    var particleGroup;
    particleGroup = new THREE.Object3D();
    var linesData = [];
    var particleTexture = new THREE.TextureLoader().load("img/lf2.png");

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
            sprite.scale.set(5, 5, 1); // imageWidth, imageHeight
            sprite.position.set(p.x, p.y, p.z);
            //material
            var spriteMaterial = new THREE.SpriteMaterial({
                map: particleTexture,
                color: 0xffffff
            });
            sprite.material.color.setHSL((h / 24) * 0.6, 1, .5);
            sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
            particleGroup.add(sprite);

            ////////////////////////
            //add to linedata array
            ////////////////////////

            linesData.push([{
                id: c.personId[i],
                lat: p.x,
                lon: p.z,
                nat: c.nation[i],
                hr: h
            }]);

        }
    }
    makeLines(linesData);
    scene.add(particleGroup);
}

function makeLines(linesData) {
    // console.log(linesData);
    const grouped = _.groupBy(linesData, linesData => linesData.id);


    console.log(grouped);
}

// if this person id is alread in array , add only hr, lat,lon, nation
// else add this person to arrary and the orher values 
// if (!linesData.find(object => object[0].id === c.personId[i])) { // if this id is a new id in linesData array
//     linesData.push( //push and get array location in p 
//         [{}, {
//             arrData
//         }]
//     );
// } else {
//     linesData[linesData.length] += arrData
// }


/////////////////// line  rending 

// lineGroup = new THREE.Object3D();
// for (let i = 0; index < linesData.length; i++) {

//     //create a blue LineBasicMaterial
//     var material = new THREE.LineBasicMaterial({
//         color: 0x0000ff
//     });
//     var geometry = new THREE.Geometry();
//     geometry.vertices.push(new THREE.Vector3(-10, 0, 0));

//     var line = new THREE.Line(geometry, material);
// }
// scene.add(lineGroup);



/*
/////////////////// flare rending 

// function Clustered(rncData, hrs, scene) {
//     var textureLoader = new THREE.TextureLoader();
//     var textureFlare = textureLoader.load("img/lf.png");
//     var flareColor = new THREE.Color(0xffffff);
//     flareColor.setHSL(0, 0, 100 + 1);
//     for (let h = 0; h < hrs; h++) {
//         let c = rncData[h].C;
//         if (rncData[h].C.lat.length > 0) {
//             for (let i = 0; i < rncData[h].C.lat.length; i++) {
//                 let p = new THREE.Vector3();
//                 p.x = 100 * ((100 * (c.lat[i])) - 4250);
//                 p.z = 100 * ((c.lon[i] * 100) - 150);
//                 p.y = h * 100;
//                 var light = new THREE.PointLight(0xffffff, 1.5, 0);
//                 light.position.set(p.x, p.y, p.z);
//                 var lensFlare = new THREE.LensFlare(textureFlare, 10, 0.0, THREE.AdditiveBlending, flareColor);
//                 lensFlare.position.copy(light.position);
//                 scene.add(lensFlare);
//             }
//         }
//     }
// }

/////////////////// Points rending 
// function Clustered(rncData, hrs, scene) {
//     var textureLoader = new THREE.TextureLoader();
//     var textureFlare = textureLoader.load("img/lf.png");
//     textureFlare.minFilter = THREE.LinearFilter;
//     var pntMaterial = new THREE.PointsMaterial({
//         // color: 0xFF0000,
//         map: textureFlare,
//         alphaTest: 0.5,
//         transparent: true,
//         size: 100
//     });
//     var pntGeo = new THREE.Geometry();
//     for (let h = 0; h < hrs; h++) {
//         let c = rncData[h].C;
//         if (rncData[h].C.lat.length > 0) {
//             for (let i = 0; i < rncData[h].C.lat.length; i++) {
//                 let p = new THREE.Vector3();
//                 p.x = 100 * ((100 * (c.lat[i])) - 4250);
//                 p.z = 100 * ((c.lon[i] * 100) - 150);
//                 p.y = h * 100;
//                 pntGeo.vertices.push(p);

//             }
//         }
//     }
//     var geometry = new THREE.Points(pntGeo, pntMaterial)
//     scene.add(geometry);
// }
*/