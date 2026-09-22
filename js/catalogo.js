import { produtos } from './produtos.js';
import { BRL } from './formato.js';
import { adicionarAoCarrinho } from './carrinho.js';

// cada categoria tem sua grade no html
const GRADES = [
    { id: 'iphone', categoria: 'iphone' },
    { id: 'ipad', categoria: 'ipad' },
    { id: 'Mac', categoria: 'Mac' },
];

function criarCard(item) {
    const card = document.createElement('article');
    card.className = 'item-card';
    card.dataset.id = item.id;

    const media = document.createElement('div');
    media.className = 'item-media';

    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.nome;
    img.loading = 'lazy';
    img.decoding = 'async';
    media.appendChild(img);

    const tag = document.createElement('span');
    tag.className = 'item-tag';
    tag.innerText = item.category;
    media.appendChild(tag);

    const corpo = document.createElement('div');
    corpo.className = 'item-body';

    const nome = document.createElement('h3');
    nome.className = 'item-name';
    nome.innerText = item.nome;

    const preco = document.createElement('p');
    preco.className = 'item-price';
    preco.innerHTML = '<span>A partir de</span>' + BRL.format(item.price);

    const botao = document.createElement('button');
    botao.className = 'add-to-cart';
    botao.type = 'button';
    botao.dataset.id = item.id;
    botao.innerHTML = '<i class="bi bi-bag-plus"></i><span>Comprar</span>';
    botao.addEventListener('click', () => adicionarAoCarrinho(item.id));

    corpo.appendChild(nome);
    corpo.appendChild(preco);
    corpo.appendChild(botao);

    card.appendChild(media);
    card.appendChild(corpo);

    return card;
}

function montarGrades() {
    GRADES.forEach(({ id, categoria }) => {
        const grade = document.getElementById(id);
        if (!grade) return;

        // fragmento evita um reflow por card
        const fragmento = document.createDocumentFragment();
        produtos
            .filter((item) => item.category === categoria)
            .forEach((item) => fragmento.appendChild(criarCard(item)));

        grade.appendChild(fragmento);
    });
}

// barra fixa do topo: um atalho por categoria, pegando a primeira imagem de cada
function montarAtalhos() {
    const barra = document.querySelector('.category-header');
    if (!barra) return;

    const categorias = [...new Map(produtos.map((item) => [item.category, item])).values()];

    categorias.forEach((item) => {
        const atalho = document.createElement('a');
        atalho.className = 'list-card';
        atalho.href = '#' + item.category;

        const img = document.createElement('img');
        img.src = item.img;
        img.alt = item.category;
        img.loading = 'lazy';

        const nome = document.createElement('span');
        nome.className = 'list-name';
        nome.innerText = item.category;

        atalho.appendChild(img);
        atalho.appendChild(nome);
        barra.appendChild(atalho);
    });
}

montarGrades();
montarAtalhos();
