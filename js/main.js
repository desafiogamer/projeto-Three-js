// Decide se vale montar a cena 3d antes de baixar o three (263 KB).
// Sem aceleracao por hardware o navegador cai no rasterizador de software e
// cada frame custa ~100ms de cpu, o que trava a pagina inteira. Nesse caso o
// hero fica com o fundo estatico do css.

const container = document.getElementById('inicio');

if (container && vale3D()) {
    import('./cena.js')
        .then(({ montarCena }) => montarCena(container))
        .catch(() => marcarSem3D());
} else {
    marcarSem3D();
}

function marcarSem3D() {
    document.body.classList.add('sem-3d');
}

function vale3D() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

    let gl = null;
    try {
        gl = document.createElement('canvas').getContext('webgl');
    } catch (e) {
        return false;
    }

    if (!gl) return false;

    return !rasterizadorDeSoftware(gl);
}

function rasterizadorDeSoftware(gl) {
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    // sem a extensao nao da pra saber, entao assume que tem gpu
    if (!info) return false;

    const nome = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || '');
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(nome);
}
