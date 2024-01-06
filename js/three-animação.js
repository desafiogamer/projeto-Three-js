import * as THREE from '../build/three.module.js';
import {OrbitControls} from '../jsm/OrbitControls.js';
import {GLTFLoader} from '../jsm/GLTFLoader.js';


function init(){
    var scene = new THREE.Scene();		
    scene.background = new THREE.Color(0x000000)
	
    var camera = new THREE.PerspectiveCamera(17, window.innerWidth / window.innerHeight, 1, 5000);	
    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    var paraFrenteLoad = true
    var flutuando = true
    var container = document.getElementById('inicio')
    renderer.setSize(window.innerWidth, window.innerHeight); 
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement); 				

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true
    controls.enableZoom = false
    controls.enablePan = false
    controls.maxPolarAngle = 1.4
    controls.update();  
   

    const loader = new GLTFLoader().setPath('./models/');
    loader.load('space_boi.glb', function(glb){
        scene.add(glb.scene);
        var box = new THREE.Box3().setFromObject(glb.scene)
        var obj_size = box.getSize(new THREE.Vector3(0,0,0))
        camera.position.z = obj_size.length()
        scene.rotation.x = 0.1
        box.getCenter(controls.target);
        glb.scene.traverse(function(child){
            child.receiveShadow = true;
            child.castShadow = true; 
        });
    });


    window.onresize = function(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function animate() {
        requestAnimationFrame(animate);

        if (paraFrenteLoad == true) {
            scene.rotation.y += 0.003
        }
        else {
            scene.rotation.y -= 0.1
        }

        if(flutuando == true){
            scene.position.y += 0.002
            
            if(scene.position.y >= 0.5){
                flutuando = false
            }
        }else{
            scene.position.y -= 0.002;
            if(scene.position.y <= 0.01){
                flutuando = true
            }
        }

        if(controls)
            controls.update();


        renderer.render(scene, camera);
        container.appendChild(renderer.domElement) 
    };
    animate();
}

window.onload = init