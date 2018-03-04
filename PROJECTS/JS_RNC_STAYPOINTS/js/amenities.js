var amenGrp = new THREE.Object3D();

function amenities() {
    //vars 
    var amenTexture = new THREE.TextureLoader().load("img/amen.png");
    $.getJSON("data/amen.json", function (d) {
        console.log("loaded amen");
        drawAmenities(d);
    });


    function drawAmenities(amenArr) {
        for (let i = 0; i < amenArr.length; i++) {
            if (amenArr[i].lat && amenArr[i].lng) {
                var spriteMaterial = new THREE.SpriteMaterial({
                    map: amenTexture,
                    transparent: true
                });
                var amemSprite = new THREE.Sprite(spriteMaterial);
                amemSprite.material.opacity = 0.5;
                amemSprite.scale.set(1, 1, 1);
                amemSprite.position.set(latCor(amenArr[i].lat), 0, lonCor(amenArr[i].lng));
                if (amemSprite) {
                    amenGrp.add(amemSprite);
                }
            }
        }
    }
    scene.add(amenGrp);
    amenGrp.visible = false;
}