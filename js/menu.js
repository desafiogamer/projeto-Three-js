let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('.icones li a');

const carrin = document.querySelector('.Comprados')

function carrinho() {
    carrin.classList.toggle('ativo')
}

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(Links => {
                Links.classList.remove('ativo');
                document.querySelector('.icones li a[href*=' + id + ']').classList.add('ativo');
            });
        }
    });
}

function formatarValor(valor) {
    return valor.toLocaleString('pt-BR');
}