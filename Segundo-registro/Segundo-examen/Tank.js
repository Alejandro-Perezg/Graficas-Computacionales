"use strict"; 

import * as THREE from './libs/three.module.js'
import * as dat from '../../dat.gui-master/build/dat.gui.module.js'
import { OrbitControls } from './libs/controls/OrbitControls.js';
import { OBJLoader } from '../../libs/three.js/loaders/OBJLoader.js';

let renderer = null, scene = null, camera = null, orbitControls = null, group = null, objectList=[];
let ambientLight = null, directionalLight = null, spotLight;
let tankObj = {obj:'Tank/Tank.obj', map:'Tank/Tank_texture.jpg'};
let turretObj = {obj:'Tank/Turret.obj', map:'Tank/Tank_texture.jpg'};
const gui = new dat.GUI();
let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;


let mapUrl = "../../images/necoarc.png";

function main()
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);

    update();
}
//troubleshooting
function onError ( err ){ console.error(err); };

function onProgress( xhr ) 
{
    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}
/////////////////////////

function update() 
{
    requestAnimationFrame(function() { update(); });
    
    renderer.render( scene, camera );

    orbitControls.update();
}

async function loadObj(objModelUrl, objectList,xpos,ypos,zpos)
{
    try
    {
        const object = await new OBJLoader().loadAsync(objModelUrl.obj, onProgress, onError);
        let texture = new THREE.TextureLoader().load(tankObj.map);
        console.log(object);
        
    
            for(const child of object.children)
            {
      
                child.castShadow = true;
                child.receiveShadow = true;    
                child.material.map = texture;
                child.material.color.set('green')

            }
        

        object.scale.set(3, 3, 3);
        object.position.z = zpos;
        object.position.x = xpos;
        object.position.y = ypos;
        object.rotation.y = ypos;
        object.name = "objObject";
        
        
        objectList.push(object);
        scene.add(object);
    }
    catch (err) 
    {
        onError(err);
    }
}


async function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;

    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFShadowMap;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(10, 1, 1.5);

    orbitControls = new OrbitControls(camera, renderer.domElement);

   // Create and add all the lights
   spotLight = new THREE.SpotLight (0xaaaaaa);
   spotLight.position.set(2, 8, 15);
   spotLight.target.position.set(-2, 0, -2);
   scene.add(spotLight);

   spotLight.castShadow = true;

   spotLight.shadow.camera.near = 1;
   spotLight.shadow.camera.far = 200;
   spotLight.shadow.camera.fov = 45;
   
   spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
   spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

//    ambientLight = new THREE.AmbientLight ( 0x444444, 0.8);
//    scene.add(ambientLight);

   loadObj(tankObj, objectList, 0,-1.5, .5);
   loadObj(turretObj, objectList, 0,-.5, .5);
    group = new THREE.Object3D
    scene.add(group);
    
    const map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

}

main();