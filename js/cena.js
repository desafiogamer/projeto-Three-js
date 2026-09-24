import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { GLTFLoader } from 'three/addons/GLTFLoader.js';

let camera, scene, renderer, mixer, clock;
let naTela = true;

export function montarCena(container) {

    camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.set(-5.8, 1, 3.7);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.position.x = 5;
    scene.position.y = -1.5;

    clock = new THREE.Clock();

    const directLight = new THREE.DirectionalLight(0xffffff, 20);
    scene.add(directLight);

    const loader = new GLTFLoader();
    loader.load('models/robot_playground.glb', function (gltf) {
        scene.add(gltf.scene);
        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
    });

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    // em tela hidpi o dpr cheio quadruplica os pixels desenhados e derruba o
    // fps; 1.5x mantem a cena nitida por bem menos custo
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // o canvas entra uma vez so, fora do loop de animacao
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);

    // renderizar com a secao fora da tela so queima cpu
    const observador = new IntersectionObserver(([entrada]) => {
        naTela = entrada.isIntersecting;
        alternarLoop();
    });
    observador.observe(container);

    document.addEventListener('visibilitychange', alternarLoop);

    alternarLoop();
}

function alternarLoop() {
    const rodando = naTela && !document.hidden;
    renderer.setAnimationLoop(rodando ? animate : null);

    // o clock continua contando parado, entao reinicio pra animacao nao pular
    if (rodando) clock.start();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);

}
