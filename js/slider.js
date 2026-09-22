const images = [
  "img/slider/1.jpg",
  "img/slider/2.jpg",
  "img/slider/3.jpg",
  "img/slider/4.jpg",
  "img/slider/5.jpg",
];

const texts = [
  ["MacBook ", "Qualidade e performance."],
  ["MacBook ", "Qualidade e performance."],
  ["IPhone ", "Transforme sua visão em uma foto."],
  ["IPhone ", "Ilumine seu futuro como este telefone."],
  ["IPad ", "Prove do melhor"],
];

const config = {
  slideImages: images,
  itemsTitles: texts,

  backgroundDisplacementSprite: "img/slider/map-9.jpg",
  cursorDisplacementSprite: "img/slider/displace-circle.png",

  cursorImgEffect: true,
  cursorTextEffect: false,
  cursorScaleIntensity: 0.65,
  cursorMomentum: 0.14,

  swipe: true,
  swipeDistance: window.innerWidth * 0.4,
  swipeScaleIntensity: 2,

  slideTransitionDuration: 1,
  transitionScaleIntensity: 30,
  transitionScaleAmplitude: 160,

  nav: true,
  navElement: ".main-nav",

  imagesRgbEffect: true,
  imagesRgbIntensity: 0.9,
  navImagesRgbIntensity: 80,

  textsDisplay: true,
  textsSubTitleDisplay: true,
  textsTiltEffect: true,
  googleFonts: ["Josefin Sans:700", "Poppins:400"],
  buttonMode: false,
  textsRgbEffect: true,
  textsRgbIntensity: 0.03,
  navTextsRgbIntensity: 15,

  textTitleColor: "#fff",
  textTitleSize: 125,
  mobileTextTitleSize: 125,
  textTitleLetterspacing: 3,

  textSubTitleColor: "white",
  textSubTitleSize: 21,
  mobileTextSubTitleSize: 21,
  textSubTitleLetterspacing: 2,
  textSubTitleOffsetTop: 90,
  mobileTextSubTitleOffsetTop: 90,
};

// pixi + tweenmax somam ~158 KB que nao fazem falta na abertura da pagina,
// entao so carregam quando a secao do carrossel esta chegando
const DEPENDENCIAS = [
  "vendor/gsap/TweenMax.min.js",
  "vendor/pixi/pixi.min.js",
  "vendor/rgb-kinetic-slider/rgbKineticSlider.js",
];

function carregarScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error("falhou ao carregar " + src));
    document.body.appendChild(script);
  });
}

function temWebGL() {
  try {
    return !!(window.WebGLRenderingContext && document.createElement("canvas").getContext("webgl"));
  } catch (e) {
    return false;
  }
}

async function iniciarCarrossel() {
  // a ordem importa: o rgbKineticSlider depende de PIXI e TweenMax no escopo global
  for (const src of DEPENDENCIAS) {
    await carregarScript(src);
  }

  new window.rgbKineticSlider(config);
}

const secao = document.getElementById("produtos");

if (secao && temWebGL()) {
  const observador = new IntersectionObserver((entradas, obs) => {
    if (!entradas[0].isIntersecting) return;

    obs.disconnect();
    iniciarCarrossel().catch((erro) => console.error(erro));
  }, { rootMargin: "300px" });

  observador.observe(secao);
}
