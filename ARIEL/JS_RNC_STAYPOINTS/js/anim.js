/////////MOVE AGENTS////////
function animPeople(data) {
    var i = 0;
    var pplGrp = new THREE.Object3D();
    var pplTexture = new THREE.TextureLoader().load("img/lf4.png");
    spwanStays();

    function spwanStays() {
        let p = data[i].S;
        var spriteMaterial = new THREE.SpriteMaterial({
            map: pplTexture,
            transparent: true
        });
        var pplSprite = new THREE.Sprite(spriteMaterial);
        pplSprite.material.color.setHex(colorByNation(data[i].N))
        pplSprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
        pplSprite.position.set(latCor(p[0].la), (p[0].s - 1475193600) / 60, lonCor(p[0].lo));
        if (data[i].N != "Andorra") {
            pplSprite.scale.set(7, 7, 7); // imageWidth, imageHeight
        } else {
            pplSprite.scale.set(1, 1, 1); // imageWidth, imageHeight

        }

        pplGrp.add(pplSprite)

        anim(pplSprite, data[i].S);
        if (i++ < data.length) {
            setTimeout(spwanStays, (p[0].s - 1475193600) / 1000); //wrong  -- this should be from alst point 
        }
    }
    scene.add(pplGrp);
}

function anim(cube, stayEvents) {
    // console.log()

    for (let e = 0; e < Object.keys(stayEvents).length; e++) {
        var tween = new TWEEN.Tween(cube.position).to({
            x: latCor(stayEvents[e].la),
            y: stayEvents[e].l / 60,
            // y: 0,
            z: lonCor(stayEvents[e].lo)
        }, stayEvents[e].l).start();
    }
}