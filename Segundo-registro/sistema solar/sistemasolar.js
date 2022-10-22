//Itzel Yanabany Castro Becerril
//Sistema Solar

import * as THREE from '../../libs/three.js/three.module.js'
import { OrbitControls } from '../../libs/three.js/controls/OrbitControls.js';
import { OBJLoader } from '../../libs/three.js/loaders/OBJLoader.js';
import { MTLLoader } from '../../libs/three.js/loaders/MTLLoader.js';

//Declaramos Variables
let renderer = null, scene = null, camera = null, group = null,map = null,orbitControls = null,
ambientLight = null,sol = null,earth =  null,mercurio = null,venus = null,marte = null,jupiter = null,
saturno = null,urano = null,neptuno = null,pluton = null,sunGrupo = null,planetMercurio = null,
planetVenus = null,planetTierra = null,planetMarte = null,planetJupiter = null,planetSaturno = null,
planetUrano = null,planetNeptuno = null,planetPluton = null,
asteroidesGrupo = null,

objectList = []
let objMtlModelUrl = {obj:'Textures/10464_Asteroid_v1_Iterations-2.obj', mtl:'Textures/10464_Asteroid_v1_Iterations-2.mtl'};
let duration = 20000; // ms
let currentTime = Date.now();

let mapUrl = 'Textures/necoarc.png';

//La función main que se encarga de llamar a las demás funciones.
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
    sunGrupo.rotation.y += angle;
    planetMercurio.rotation.y += angle;
    movePlanets(planetMercurio, 150, 10)
    planetVenus.rotation.y += angle;
    movePlanets(planetVenus, 200, 8)
    planetTierra.rotation.y += angle;
    movePlanets(planetTierra, 250, 7)    
    planetMarte.rotation.y += angle;
    movePlanets(planetMarte, 310, 5)
    planetJupiter.rotation.y += angle;
    movePlanets(planetJupiter, 500, 3)
    planetSaturno.rotation.y += angle;
    movePlanets(planetSaturno, 675, 1)
    planetUrano.rotation.y += angle;
    movePlanets(planetUrano, 775, 0.7)
    planetNeptuno.rotation.y += angle;
    movePlanets(planetNeptuno, 875, 0.4)  
    planetPluton.rotation.y += angle;
    movePlanets(planetPluton, 930, 0.1)  
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
async function createSol(x,y,z,url,grupo) {
    try {
        const sol = await createSphere(x,y,z,url)

        grupo.add(sol)

    } catch (err) {
        return err
    }
}

//Creación de los planetas
async function createPlanet(x,y,z,url,grupo, xG) {
    try {
        const planet = await createSphere(x,y,z,url)

        grupo.add(planet)

        grupo.position.set(xG, 0, 0);

    } catch (err) {
        return onError(err)
    }
}

//Creación de las lunas para los planetas.
async function createMoons(x,y,z,url,grupo, Gx) {
    try {
        const moon = await createSphere(x,y,z,url)

        grupo.add(moon)

        moon.position.set(Gx, 0, 0);

    } catch (err) {
        return onError(err)
    }
}

async function createRingSaturno(x,y,z,url,grupo) {
    try {
        const ring = await createRing(x,y,z,url)

        grupo.add(ring);
        
        ring.position.set(0, 0, 0);

    } catch (err) {
        return onError(err)
    }
}

//Movimientos de los planetas.
async function movePlanets(grupo, orbitRadius, time) {
    time = time * 0.0001;
    let date = Date.now() * time;
    grupo.position.set(Math.cos(date) * orbitRadius, 0, Math.sin(date) * orbitRadius);
}

//Creación de las orbitas.
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

//Creación de la escena
function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);

    renderer.shadowMap.enabled = true;
    
    renderer.shadowMap.type = THREE.BasicShadowMap;
    
    let background_image = new THREE.TextureLoader().load("Textures/stars.jpg")

    background_image.minFilter = THREE.LinearFilter;
    scene = new THREE.Scene();

    scene.background = background_image;

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(1500, 300, 0);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    
    // Luz direccional que se agregará a la escena.
    const pointLight = new THREE.PointLight(0xff0000, 1, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);


    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    ambientLight = new THREE.AmbientLight( 0x444444, 5);
    scene.add(ambientLight);


    let a = 0;
    let b = 0;
    for (let i = 0; i < 28 ; i ++) {
        a = a += 30
        b = b += 30
        let positionx = Math.cos(a) * 380
        let positionz = Math.sin(b) * 380
        loadObjMtl(objMtlModelUrl, objectList, positionx, positionz)
    }

    let j = 0;
    let k = 0;
    for (let i = 0; i < 36 ; i ++) {
        j = j += 10
        k = k += 10
        let positionx = Math.cos(j) * 400
        let positionz = Math.sin(k) * 400
        loadObjMtl(objMtlModelUrl, objectList, positionx, positionz)
    }

    let c = 0;
    let d = 0;
    for (let i = 0; i < 20 ; i ++) {
        c = c += 20
        d = d += 20
        let positionx = Math.cos(c) * 420
        let positionz = Math.sin(d) * 420
        loadObjMtl(objMtlModelUrl, objectList, positionx, positionz)
    }

     //Agregammos a los grupos correspondientes 
    group = new THREE.Object3D;
    scene.add(group);

    sunGrupo = new THREE.Object3D;
    group.add(sunGrupo)

    asteroidesGrupo = new THREE.Object3D;
    sunGrupo.add(asteroidesGrupo)

    planetMercurio = new THREE.Object3D;
    sunGrupo.add(planetMercurio)

    planetVenus = new THREE.Object3D;
    sunGrupo.add(planetVenus)

    planetTierra = new THREE.Object3D;
    sunGrupo.add(planetTierra)

    planetMarte = new THREE.Object3D;
    sunGrupo.add(planetMarte)

    planetJupiter = new THREE.Object3D;
    sunGrupo.add(planetJupiter)

    planetSaturno = new THREE.Object3D;
    sunGrupo.add(planetSaturno)

    planetUrano = new THREE.Object3D;
    sunGrupo.add(planetUrano)

    planetNeptuno = new THREE.Object3D;
    sunGrupo.add(planetNeptuno)

    planetPluton = new THREE.Object3D;
    sunGrupo.add(planetPluton)


    //Agregamos lunas 
    const lunaTierra = new THREE.Object3D;
    planetTierra.add(lunaTierra)

    const lunaMarte = new THREE.Object3D;
    planetMarte.add(lunaMarte)

    const lunaJupiter = new THREE.Object3D;
    planetJupiter.add(lunaJupiter)

    const lunaSaturno = new THREE.Object3D;
    planetSaturno.add(lunaSaturno)

    const lunaUrano = new THREE.Object3D;
    planetUrano.add(lunaUrano)

    const lunaNeptuno = new THREE.Object3D;
    planetNeptuno.add(lunaNeptuno)

    const lunaPluton = new THREE.Object3D;
    planetPluton.add(lunaPluton)

    //Creación de planetas.
    sol = createSol(100,100,100, 'Textures/sun.jpg', sunGrupo);

    mercurio = createPlanet(10,10,10, 'Textures/mercury.jpg', planetMercurio, 150);
    createOrbits(150)

    venus = createPlanet(20,20,20, 'Textures/venus.jpg', planetVenus, 200);
    createOrbits(200)

    earth = createPlanet(20,20,20, 'Textures/earth.jpg', planetTierra, 250);
    createOrbits(250)

    marte = createPlanet(10,10,10, 'Textures/mars.jpg', planetMarte, 310);
    createOrbits(310)

    createOrbits(400)

    jupiter = createPlanet(50,50,50, 'Textures/jupiter.jpg', planetJupiter, 500);
    createOrbits(500)

    saturno = createPlanet(40,40,40, 'Textures/saturn.jpg', planetSaturno, 675);
    createOrbits(675)
    createRingSaturno(50,70,30,'Textures/ring.png',planetSaturno)

    urano = createPlanet(30,30,30, 'Textures/uranus.jpg', planetUrano, 775);
    createOrbits(775)

    neptuno = createPlanet(30,30,30, 'Textures/neptune.jpg', planetNeptuno, 875);
    createOrbits(875)

    pluton = createPlanet(9,9,9, 'Textures/pluto.jpg', planetPluton, 930);
    createOrbits(930)

    //Creación de lunas para cada planeta.
    createMoons(7,7,7, 'Textures/moon.jpg', lunaTierra, 30);
    createMoons(5,5,5, 'Textures/moon.jpg', lunaMarte, 20);
    createMoons(5,5,5, 'Textures/moon.jpg', lunaJupiter, 60);
    createMoons(5,5,5, 'Textures/moon.jpg', lunaUrano, 40);
    createMoons(5,5,5, 'Textures/moon.jpg', lunaNeptuno, 40);
    createMoons(5,5,5, 'Textures/moon.jpg', lunaPluton, 15);
   



    const map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

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