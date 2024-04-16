import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../jsm/OrbitControls.js';
import { GLTFLoader } from '../jsm/GLTFLoader.js';

var container
var camera, scene, renderer, mixer, clock;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.set(-5.8, 1, 3.7);

    scene = new THREE.Scene();

    clock = new THREE.Clock();

    const directLight = new THREE.DirectionalLight(0xffffff, 20)
    scene.add(directLight)

    var loader = new GLTFLoader();
    loader.load('./models/robot_playground.glb', function (gltf) {
        scene.add(gltf.scene);
        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });

    });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    var pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.update(); 

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}


var container = document.getElementById('inicio')

function animate() {

    requestAnimationFrame(animate);

    var delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    scene.background = new THREE.Color(0x050505)
    scene.position.x = 5
    scene.position.y = -1.5

    renderer.render(scene, camera);
    container.appendChild(renderer.domElement) 

}
