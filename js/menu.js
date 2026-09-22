let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('.icones li a');

const carrin = document.querySelector('.Comprados')
const overlay = document.querySelector('.cart-overlay')

function setCarrinho(aberto) {
    carrin.classList.toggle('ativo', aberto);
    if (overlay) overlay.classList.toggle('ativo', aberto);
    document.body.classList.toggle('no-scroll', aberto);
}

function carrinho() {
    setCarrinho(!carrin.classList.contains('ativo'));
}

window.abrirCarrinho = () => setCarrinho(true);
window.fecharCarrinho = () => setCarrinho(false);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setCarrinho(false);
});

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
