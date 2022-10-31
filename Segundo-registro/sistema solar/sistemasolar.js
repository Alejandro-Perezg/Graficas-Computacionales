import * as THREE from '../../libs/three.js/three.module.js'
import { OrbitControls } from '../../libs/three.js/controls/OrbitControls.js';
import { OBJLoader } from '../../libs/three.js/loaders/OBJLoader.js';
import { MTLLoader } from '../../libs/three.js/loaders/MTLLoader.js';

//Declaramos Variables
let renderer = null, scene = null, camera = null, group = null,map = null,orbitControls = null,
ambientLight = null,sun = null,earth =  null,mercury = null,venus = null,mars = null,jupiter = null,
saturn = null,uranus = null,neptune = null,pluto = null,sunGroup = null,planetMercurio = null,
planetVenus = null,planetEarth = null,planetMarte = null,planetJupiter = null,planetSaturn = null,
planetUranus = null,planetNeptune = null,planetPluto = null,
asteroidesGrupo = null, 

objectList = []
let objMtlModelUrl = {obj:'Textures/10464_Asteroid_v1_Iterations-2.obj', mtl:'Textures/10464_Asteroid_v1_Iterations-2.mtl'};
let duration = 20000; // ms
let currentTime = Date.now();



function main()
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
}

function onError ( err ){ console.error( err ); };

function onProgress( xhr ) 
{
    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

async function loadObjMtl(objModelUrl, objectList, Gx, Gz)
{
    console.log("Entra a carga objetos")
    try
    {
        const mtlLoader = new MTLLoader();
        const materials = await mtlLoader.loadAsync(objModelUrl.mtl, onProgress, onError);
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        const object = await objLoader.loadAsync(objModelUrl.obj, onProgress, onError);
        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        object.position.set(Gx,0,Gz);
        object.scale.set(.01, .01, .01);
        objectList.push(object);
        asteroidesGrupo.add(object);
    }
    catch (err)
    {
        onError(err);
    }
}

/**
 * Updates the rotation of the objects in the scene
 */
function animate() {
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 1 * fract; 
    sunGroup.rotation.y += angle;
    planetMercurio.rotation.y += angle;
    movePlanets(planetMercurio, 150, 10)
    planetVenus.rotation.y += angle;
    movePlanets(planetVenus, 200, 8)
    planetEarth.rotation.y += angle;
    movePlanets(planetEarth, 250, 7)    
    planetMarte.rotation.y += angle;
    movePlanets(planetMarte, 310, 5)
    planetJupiter.rotation.y += angle;
    movePlanets(planetJupiter, 500, 3)
    planetSaturn.rotation.y += angle;
    movePlanets(planetSaturn, 675, 1)
    planetUranus.rotation.y += angle;
    movePlanets(planetUranus, 775, 0.7)
    planetNeptune.rotation.y += angle;
    movePlanets(planetNeptune, 875, 0.4)  
    planetPluto.rotation.y += angle;
    movePlanets(planetPluto, 930, 0.1)  
}

/**
 * Runs the update loop: updates the objects in the scene
 */
function update() 
{
    requestAnimationFrame(function() { update(); });
    var time = Date.now();
    movePlanets(earth, time)
    renderer.render( scene, camera );
    animate();
    orbitControls.update();
}

//Creación de las esferas para los planetas.
async function createSphere(x,y,z,url){
    return new Promise(async (resolve) => {
        const textureUrl = url;
        //Texturas del shader material 
        const texture = new THREE.TextureLoader().load(textureUrl);
        const material = new THREE.MeshPhongMaterial({ map: texture });
        
        let geometry = new THREE.SphereGeometry (x,y,z);

        let sphere = new THREE.Mesh(geometry, material);
        sphere.receiveShadow = true;

        resolve(sphere)
    })
}

//Creacion de los anillos para los planetas
async function createRing(x,y,z,url) {
    return new Promise(async (resolve) => {
        const textureUrl = url;
        //Texturas del shader material
        const texture = new THREE.TextureLoader().load(textureUrl);
        const material = new THREE.MeshPhongMaterial({ map: texture });

        let geometry = new THREE.RingGeometry (x,y,z);

        let ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = 30;
        ring.visible = true;
        ring.DoubleSide = true;

        resolve(ring)

    })
}

//Creación del sol
async function createSun(x,y,z,url,grupo) {
    try {
        const sol = await createSphere(x,y,z,url)
        sol.castShadow = false;
        sol.receiveShadow = true;

        grupo.add(sol)

    } catch (err) {
        return err
    }
}

async function createPlanet(x,y,z,url,grupo, xG) {
    try {   
        const planet = await createSphere(x,y,z,url)
        planet.castShadow =false;
        planet.receiveShadow = true;
        grupo.add(planet)

        grupo.position.set(xG, 0, 0);

    } catch (err) {
        return onError(err)
    }
}


async function createMoons(x,y,z,url,grupo, Gx) {
    try {
        const moon = await createSphere(x,y,z,url)
        

        grupo.add(moon)

        moon.position.set(Gx, 0, 0);

    } catch (err) {
        return onError(err)
    }
}

async function createSaturnRing(x,y,z,url,grupo) {
    try {
        const ring = await createRing(x,y,z,url)

        grupo.add(ring);
        
        ring.position.set(0, 0, 0);

    } catch (err) {
        return onError(err)
    }
}




async function createOrbits(orbitPlanet) {
    var shape = new THREE.Shape();
    shape.moveTo(orbit, 0);
    shape.absarc(0, 0, orbitPlanet, 0, 2 * Math.PI, false);
    var spacedPoints = shape.getSpacedPoints(128);
    var orbitGeom = new THREE.BufferGeometry().setFromPoints(spacedPoints); 
    orbitGeom.rotateX(THREE.Math.degToRad(-90));
    var orbit = new THREE.Line(orbitGeom, new THREE.LineBasicMaterial({
        color: "white"
    }));
    group.add(orbit);
}

async function movePlanets(grupo, orbitRadius, time) {
    time = time * 0.0001;
    let date = Date.now() * time;
    grupo.position.set(Math.cos(date) * orbitRadius, 0, Math.sin(date) * orbitRadius);
}


function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);

    renderer.shadowMap.enabled = true;
    
    renderer.shadowMap.type = THREE.PCFShadowMap;
    
    let background_image = new THREE.TextureLoader().load("Textures/stars.jpg")

    background_image.minFilter = THREE.LinearFilter;
    scene = new THREE.Scene();

    scene.background = background_image;

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(1500, 300, 0);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    
 //lights
    const pointLight = new THREE.PointLight(0xff0000, 2, 300);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
    ambientLight = new THREE.AmbientLight( 0x444444, 3);
    scene.add(ambientLight);


    let a = 0,b = 0;
    for (let i = 0; i < 28 ; i ++) {
        a = a += 30
        b = b += 30
        let xpos = Math.cos(a) * 380
        let zpos = Math.sin(b) * 380
        loadObjMtl(objMtlModelUrl, objectList, xpos, zpos)
    }

    let c = 0, d = 0;
    for (let i = 0; i < 36 ; i ++) {
        c = c += 10
        d = d += 10
        let xPos = Math.cos(c) * 400
        let zpos = Math.sin(d) * 400
        loadObjMtl(objMtlModelUrl, objectList, xPos, zpos)
    }

    let e = 0,f = 0;
    for (let i = 0; i < 20 ; i ++) {
        e = e += 20
        f = f += 20
        let xpos = Math.cos(e) * 420
        let zpos = Math.sin(f) * 420
        loadObjMtl(objMtlModelUrl, objectList, xpos, zpos)
    }

     //maingroup aggregation
    group = new THREE.Object3D;
    scene.add(group);

    sunGroup = new THREE.Object3D;
    group.add(sunGroup)

    asteroidesGrupo = new THREE.Object3D;
    sunGroup.add(asteroidesGrupo)

    planetMercurio = new THREE.Object3D;
    sunGroup.add(planetMercurio)

    planetVenus = new THREE.Object3D;
    sunGroup.add(planetVenus)

    planetEarth = new THREE.Object3D;
    sunGroup.add(planetEarth)

    planetMarte = new THREE.Object3D;
    sunGroup.add(planetMarte)

    planetJupiter = new THREE.Object3D;
    sunGroup.add(planetJupiter)

    planetSaturn = new THREE.Object3D;
    sunGroup.add(planetSaturn)

    planetUranus = new THREE.Object3D;
    sunGroup.add(planetUranus)

    planetNeptune = new THREE.Object3D;
    sunGroup.add(planetNeptune)

    planetPluto = new THREE.Object3D;
    sunGroup.add(planetPluto)




    //moon agg
    const earthMoon = new THREE.Object3D;
    planetEarth.add(earthMoon)

    const masrMoon = new THREE.Object3D;
    planetMarte.add(masrMoon)

    const jupiterMoon = new THREE.Object3D;
    planetJupiter.add(jupiterMoon)

    const lunaSaturno = new THREE.Object3D;
    planetSaturn.add(lunaSaturno)

    const uranusMoon = new THREE.Object3D;
    planetUranus.add(uranusMoon)

    const neptuneMoon = new THREE.Object3D;
    planetNeptune.add(neptuneMoon)

    const plutoMoon = new THREE.Object3D;
    planetPluto.add(plutoMoon)

    //Creación de planetas.
    sun = createSun(100,100,100, 'Textures/sun.jpg', sunGroup);

    mercury = createPlanet(10,10,10, 'Textures/mercury.jpg', planetMercurio, 150);
    createOrbits(150)

    venus = createPlanet(20,20,20, 'Textures/venus.jpg', planetVenus, 200);
    createOrbits(200)

    earth = createPlanet(20,20,20, 'Textures/earth.jpg', planetEarth, 250);
    createOrbits(250)

    mars = createPlanet(10,10,10, 'Textures/mars.jpg', planetMarte, 310);
    createOrbits(310)

    jupiter = createPlanet(50,50,50, 'Textures/jupiter.jpg', planetJupiter, 500);
    createOrbits(500)

    saturn = createPlanet(40,40,40, 'Textures/saturn.jpg', planetSaturn, 675);
    createOrbits(675)

    createSaturnRing(50,70,30,'Textures/ring.png',planetSaturn)

    uranus = createPlanet(30,30,30, 'Textures/uranus.jpg', planetUranus, 775);
    createOrbits(775)

    neptune = createPlanet(30,30,30, 'Textures/neptune.jpg', planetNeptune, 875);
    createOrbits(875)

    pluto = createPlanet(9,9,9, 'Textures/necoarc.png', planetPluto, 930);
    createOrbits(930)



    //Creación de lunas para cada planeta.
    createMoons(7,7,7, 'Textures/moon.jpg', earthMoon, 30);
    createMoons(5,5,5, 'Textures/moon.jpg', masrMoon, 20);
    createMoons(5,5,5, 'Textures/moon.jpg', jupiterMoon, 60);
    createMoons(5,5,5, 'Textures/moon.jpg', uranusMoon, 40);
    createMoons(5,5,5, 'Textures/moon.jpg', neptuneMoon, 40);
    createMoons(5,5,5, 'Textures/moon.jpg', plutoMoon, 15);
   





    let geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));
    
    geometry = new THREE.CylinderGeometry(1, 2, 2, 50, 10);
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial());
    mesh.position.y = -3;
    mesh.castShadow = false;
    mesh.receiveShadow = true;    
    group.add( mesh );


}

main();
