import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../jsm/OrbitControls.js';
import { GLTFLoader } from '../jsm/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js';

var container, controls;
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

    const directLight = new THREE.DirectionalLight(0x1E90FF, 20)
    scene.add(directLight)

    new RGBELoader()
        .setDataType(THREE.UnsignedByteType)
        .setPath('./texture/')
        .load('laufenurg_church_1k.hdr', function (texture) {
            var envMap = pmremGenerator.fromEquirectangular(texture).texture;
            scene.environment = envMap;
            texture.dispose();
            pmremGenerator.dispose();

            var loader = new GLTFLoader();
            loader.load('./models/robot_playground.glb', function (gltf) {
                scene.add(gltf.scene);
                mixer = new THREE.AnimationMixer(gltf.scene);
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
            });
        });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    var pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true
    controls.enableZoom = false
    controls.enablePan = false
    controls.maxPolarAngle = 1.1
    controls.update(); 

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

var flutuando = true
var container = document.getElementById('inicio')

function animate() {

    requestAnimationFrame(animate);

    if (flutuando == true) {
        scene.position.y += 0.002

        if (scene.position.y >= 0.2) {
            flutuando = false
        }
    } else {
        scene.position.y -= 0.002;
        if (scene.position.y <= 0.01) {
            flutuando = true
        }
    }

    var delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    scene.background = new THREE.Color(0x002142)
    scene.position.x = 3
    scene.position.y = -2

    renderer.render(scene, camera);
    container.appendChild(renderer.domElement) 

}
