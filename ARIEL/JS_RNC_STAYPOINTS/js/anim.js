/////////MOVE AGENTS////////
function animPeople(data) {
    var i = 0;
    spwanStays();

    function spwanStays() {
        let p = data[i].S;
        // if (data[i].N != "Andorra") {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({
            color: 'white'
        });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(latCor(p[0].la), (p[0].s - 1475193600) / 60, lonCor(p[0].lo));
        cube.material.color.setHex(colorByNation(data[i].N))
        scene.add(cube)
        anim(cube, data[i].S);
        // }
        if (i++ < data.length) {
            setTimeout(spwanStays, (p[0].s - 1475193600) / 1000); //wrong  -- this should be from alst point 
        }
    }
}

function anim(cube, stayEvents) {
    // console.log()

    for (let e = 0; e < Object.keys(stayEvents).length; e++) {
        var tween = new TWEEN.Tween(cube.position).to({
            x: latCor(stayEvents[e].la),
            y: stayEvents[e].l / 60,
            z: lonCor(stayEvents[e].lo)
        }, stayEvents[e].l).start();
    }
}