"use strict"; 

import * as THREE from './libs/three.module.js'
import * as dat from '../../dat.gui-master/build/dat.gui.module.js'
import { OrbitControls } from './libs/controls/OrbitControls.js';
import { OBJLoader } from '../../libs/three.js/loaders/OBJLoader.js';

let renderer = null, scene = null, camera = null, orbitControls = null, group = null, objectList=[];
let ambientLight = null;
let tankObj = {obj:'Tank/Tank.obj', map:'Tank/Tank_texture.jpg'};
let turretObj = {obj:'Tank/Turret.obj', map:'Tank/Tank_texture.jpg'};
const gui = new dat.GUI();
let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;


let mapUrl = "./checker_large.gif";

function main()
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);

    update();
}

function onError ( err ){ console.error(err); };

function onProgress( xhr ) 
{
    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

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

        let texture = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(tankObj.map) : null;
        let normalMap = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.normalMap) : null;
        let specularMap = objModelUrl.hasOwnProperty('specularMap') ? new THREE.TextureLoader().load(objModelUrl.specularMap) : null;

        console.log(object);
        
        // object.traverse(function (child) 
        // {
            for(const child of object.children)
            {
                //     if (child.isMesh)
                child.castShadow = true;
                child.receiveShadow = true;    
                child.material.map = texture;
                child.material.normalMap = normalMap;
                child.material.specularMap = specularMap;
            }
        // });

        object.scale.set(3, 3, 3);
        object.position.z = zpos;
        object.position.x = xpos;
        object.position.y = ypos;
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

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(0, 3, 10);

    orbitControls = new OrbitControls(camera, renderer.domElement);

    ambientLight = new THREE.AmbientLight ( 0x444444, 0.8);
    scene.add(ambientLight);

    loadObj(tankObj, objectList, 0,-1.5,-3);
    loadObj(turretObj, objectList, 0,-.5,-3);
    group = new THREE.Object3D
    scene.add(group);
    
    const map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    scene.add( mesh );

}

main();