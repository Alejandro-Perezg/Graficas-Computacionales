"use strict"; 

import * as THREE from "../libs/three.js/three.module.js"
//import {addMouseHandler} from "./sceneHandlers.js"

let renderer = null, scene = null, camera = null, shoulder = null, arm = null, elbow = null, armGroup = null, shoulderGroup = null, elbowGroup = null;

const duration = 5000; // ms
let currentTime = Date.now();

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
}

/**
 * Updates the rotation of the objects in the scene
 */
function animate() 
{
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;
    const fract = deltat / duration;
    const angle = Math.PI * 2 * fract;

    // Rotate the cube about its Y axis
    // cube.rotation.y += angle;
    shoulder.rotation.y += angle;
    shoulderGroup.rotation.y += angle;
    

    // Rotate the sphere group about its Y axis
    armGroup.rotation.x -= angle / 2;
    arm.rotation.y += angle * 2;

    // Rotate the cone about its X axis (tumble forward)
    elbowGroup.rotation.x += angle;
}

/**
 * Runs the update loop: updates the objects in the scene
 */
function update()
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    //animate();
}

/**
 * Creates a basic scene with lights, a camera, and 3 objects
 * @param {canvas} canvas The canvas element to render on
 */
function createScene(canvas)
{   
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 20 );
    camera.position.z = 10;
    scene.add(camera);
    // Add a directional light to show off the objects
    const light = new THREE.DirectionalLight( 0xffffff, 1.0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);

    const textureUrl = "../images/necoarc.png";
    const texture = new THREE.TextureLoader().load(textureUrl);
    const material = new THREE.MeshPhongMaterial({ map: texture });

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    const ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);

    // Create a group to hold all the objects
    shoulderGroup = new THREE.Object3D;
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    shoulder = new THREE.Mesh(geometry, material);
    shoulder.rotation.y = Math.PI / 5;
    shoulderGroup.add( shoulder );
    shoulderGroup.position.set(0, 3.5, 0);
    armGroup = new THREE.Object3D;
    shoulderGroup.add(armGroup);
    

    // Create the sphere geometry
    geometry = new THREE.BoxGeometry(0.5,3,0.5);
    arm = new THREE.Mesh(geometry, material);
    arm.rotation.y = Math.PI / 5;
    armGroup.add( arm );
    armGroup.position.set(0,-1, 0);
    elbowGroup = new THREE.Object3D();
    armGroup.add(elbowGroup);

    // Create the cone geometry
    geometry = new THREE.BoxGeometry(1, 1, 1);
    elbow = new THREE.Mesh(geometry, material);
    elbow.rotation.y = Math.PI / 5;
    elbowGroup.add( elbow );
    elbowGroup.position.set(0,-2,0)
    forearmGroup = new THREE.Object3D();
    elbowGroup.add(forearmGroup);

    // geometry = new THREE.BoxGeometry(0.5,3,0.5);
    // forearm = new THREE.Mesh(geometry, material);
    // forear



    scene.add( shoulderGroup );


    // add mouse handling so we can rotate the scene
    //addMouseHandler(canvas, cubeGroup);

    // This code gets the world position of the cone.
    const coneWorldPosition = new THREE.Vector3();

    // cubeGroup.updateMatrixWorld();
    // sphereGroup.updateMatrixWorld();
    // cone.updateMatrixWorld();

}

main();