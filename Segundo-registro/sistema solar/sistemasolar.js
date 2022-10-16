"use strict";

import * as THREE from "../../libs/three.js/three.module.js"
import { OrbitControls } from '../../libs/three.js/controls/OrbitControls.js';

let renderer = null, scene = null, camera = null, group = null, objectList = [], orbitControls = null;

let duration = 20000; 
let currentTime = Date.now();

let directionalLight = null, spotLight = null, ambientLight = null;

function main()
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);
    
    update();
}
function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 26 * fract;

    for(const object of objectList){ //movimiento
        if(object)
            object.rotation.y += angle / 2;
    }

    for(const object in objectList){
        if(object){
            
        }
    }
}

function update() 
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();

    // Update the camera controller
    orbitControls.update();
}


function createScene(canvas) 
{
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFShadowMap;
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-2, 6, 12);

    orbitControls = new OrbitControls(camera, renderer.domElement);
        
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xaaaaaa, 4);

    //Background
    const background_texture = new THREE.TextureLoader().load('Textures/stars_background.jpg')
    scene.background = background_texture

    // Create and add all the lights
    const point_light = new THREE.PointLight(0xFFFFFF, 2, 300)
    scene.add(point_light)

    ambientLight = new THREE.AmbientLight ( 0x444444, 0.8);
    scene.add(ambientLight);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
main()