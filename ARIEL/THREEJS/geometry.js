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
        color: 0xffffff
    });
    var geometry = new THREE.Points(pntGeo, pntMaterial)
    scene.add(geometry);
}

function Clustered(rncData, hrs, scene) {

    var material = new THREE.MeshBasicMaterial({
        color: 0xFF0000
    });
    for (let h = 0; h < hrs; h++) {
        let c = rncData[h].C;
        if (rncData[h].C.lat.length > 0) {
            for (let i = 0; i < rncData[h].C.lat.length; i++) {
                x = 100 * ((100 * (c.lat[i])) - 4250);
                z = 100 * ((c.lon[i] * 100) - 150);
                y = h * 100;
                var geometry = new THREE.SphereGeometry(1, 1, 1);
                var sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(x, y, z);
                scene.add(sphere);
            }
        }
    }
}