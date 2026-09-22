import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { GLTFLoader } from 'three/addons/GLTFLoader.js';

// 30 fps dao conta de uma animacao de fundo e custam metade do render
const FPS = 30;
const INTERVALO = 1 / FPS;

let camera, scene, renderer, mixer, clock;
let naTela = true;
let acumulado = 0;

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
    // acima de 2x o ganho visual nao paga o custo de render
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    acumulado += delta;
    if (acumulado < INTERVALO) return;

    if (mixer) mixer.update(acumulado);
    acumulado = 0;

    renderer.render(scene, camera);

}
