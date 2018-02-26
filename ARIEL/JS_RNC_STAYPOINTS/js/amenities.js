fetch("data/amen.csv")
    // fetch("https://cityio.media.mit.edu/api/table/virtual_table")
    .then(function (d) {
        // return d.json();
        return d.text();
    }).then(function (d) {
        // console.log(d);
        csvToamenArr(d);
    })
    .catch(function () {
        console.log("error");
    });




function csvToamenArr(d) {
    var amenArr = [];
    var lines = d.split('\n')
    for (let i = 0; i < lines.length; i++) {
        let a = lines[i].split(',')
        amenArr.push(a);
    }
    drawAmenities(amenArr);
}

//declare global
var amenGrp = new THREE.Object3D();
var amenTexture = new THREE.TextureLoader().load("img/amen.png");

function drawAmenities(amenArr) {

    for (let i = 0; i < amenArr.length; i++) {
        var spriteMaterial = new THREE.SpriteMaterial({
            map: amenTexture,
            transparent: true
        });
        var amemSprite = new THREE.Sprite(spriteMaterial);
        amemSprite.material.opacity = 0.8;
        amemSprite.scale.set(2, 2, 2);
        amemSprite.position.set(latCor(amenArr[i][2]), 0, lonCor(amenArr[i][3]));
        amenGrp.add(amemSprite);
    }
    scene.add(amenGrp);
    amenGrp.visible = false;
}