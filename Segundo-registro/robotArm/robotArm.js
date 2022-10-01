"use strict"; 

import * as THREE from "../../libs/three.js/three.module.js"
import * as dat from "../../dat.gui/build/dat.gui.module.js"

let renderer = null, scene = null, camera = null;
let upperArm = null, shoulder=null,elbow=null,forearm=null,wrist=null,hand=null, armGroup = null, shoulderGroup=null,elbowGroup=null,forearmGroup=null,wristGroup=null,handGroup=null,upperArmGroup=null 

const gui = new dat.GUI();

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
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
    animate();
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
    scene.background = new THREE.Color( 0,0,0 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 20 );
    camera.position.z = 15;
    scene.add(camera);

    // Create a group to hold all the objects
    armGroup = new THREE.Object3D;
    //Create the shoulder group
    shoulderGroup = new THREE.Object3D;
    armGroup.add(shoulderGroup);
   
    
   
    const light = new THREE.DirectionalLight( 0xffffff, 1.0);

    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);

 
    const ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);

    const textureUrl = "../../images/necoarc.png";
    const texture = new THREE.TextureLoader().load(textureUrl);
    const material = new THREE.MeshPhongMaterial({ map: texture });

    // Create the shoulder geometry
    let geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    // And put the geometry and material together into a mesh
    shoulder = new THREE.Mesh(geometry,material);
    armGroup.position.set(0.5,4,0);
    armGroup.rotation.set(0.3,1.5,2);
    // Add the shoulder to our group
    shoulderGroup.add(shoulder);
    shoulderGroup.position.set(0,0,0);

    //Create a group for the upper arm
    upperArmGroup = new THREE.Object3D;
    shoulderGroup.add(upperArmGroup);
    //Move the upper arm group
    upperArmGroup.position.set(-1.6,0,0);
    //Create the upper arm geometry and crete a mesh
    geometry = new THREE.BoxGeometry(2.5, 1.3, 1.3);
    upperArm = new THREE.Mesh(geometry,material);
    //Tilt the shoulder mesh
    gui.add(shoulderGroup.rotation, "y").min(-2).max(1).step(0.1).name("shoulder y")
    gui.add(shoulderGroup.rotation, "z").min(-1.7).max(3).step(0.1).name("shoulder z")
    //Add the upper arm mesh into our group
    upperArmGroup.add(upperArm);

    // Create a group for the elbow
    elbowGroup = new THREE.Object3D;
    upperArmGroup.add(elbowGroup);
    //Move the elbow group
    elbowGroup.position.set(-1.6,0,0);
    //Create the elbow geometry and crete a mesh
    geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    elbow = new THREE.Mesh(geometry,material);
    //Tilt the elbow mesh
    gui.add(elbowGroup.rotation, "z").min(-2).max(0.2).step(0.1).name("elbow z")
    //Add the elbow mesh into our group
    elbowGroup.add(elbow);

    // Create a group for the forearm
    forearmGroup = new THREE.Object3D;
    elbowGroup.add(forearmGroup);
    //Move the forearm group
    forearmGroup.position.set(-1.6,0,0);
    //Create the forearm geometry and crete a mesh
    geometry = new THREE.BoxGeometry(2.5, 1.3, 1.3);
    forearm = new THREE.Mesh(geometry,material);
    //Tilt the forearm mesh
    gui.add(forearmGroup.rotation, "x").min(-0.2).max(4.8).step(0.1).name("forearm x")
    //Add the forearm mesh into our group
    forearmGroup.add(forearm); 
    
    // Create a group for the wrist
    wristGroup = new THREE.Object3D;
    forearmGroup.add(wristGroup);
    
    wristGroup.position.set(-1.6,0,0);

    geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    wrist = new THREE.Mesh(geometry,material);
    //Tilt the wrist mesh
    gui.add(wristGroup.rotation, "z").min(-1.7).max(0.3).step(0.1).name("wrist z")
    //Add the wrist mesh into our group
    wristGroup.add(wrist);

    // Create a group for the hand
    handGroup = new THREE.Object3D;
    wristGroup.add(handGroup);
    //Move the hand group
    handGroup.position.set(-0.8,0,0);
    //Create the hand geometry and crete a mesh
    geometry = new THREE.BoxGeometry(1, 1, 1);
    hand = new THREE.Mesh(geometry,material);
    //Tilt the hand mesh
    gui.add(handGroup.rotation, "z").min(-0.2).max(0.2).step(0.1).name("hand z")
    gui.add(handGroup.rotation, "y").min(-0.3).max(0.3).step(0.1).name("hand y")
    //Add the hand mesh into our group
    handGroup.add(hand);

    // Now add the group to our scene
    scene.add( armGroup );
}

main();