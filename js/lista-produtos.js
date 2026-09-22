import { produtos } from './products.js'

const BRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const GRIDS = [
    { id: 'iphone', category: 'iphone' },
    { id: 'ipad', category: 'ipad' },
    { id: 'Mac', category: 'Mac' },
];

/* ---------------------------------------------------------------- catálogo */

function createCard(item) {
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

    const body = document.createElement('div');
    body.className = 'item-body';

    const name = document.createElement('h3');
    name.className = 'item-name';
    name.innerText = item.nome;

    const price = document.createElement('p');
    price.className = 'item-price';
    price.innerHTML = '<span>A partir de</span>' + BRL.format(item.price);

    const button = document.createElement('button');
    button.className = 'add-to-cart';
    button.type = 'button';
    button.dataset.id = item.id;
    button.innerHTML = '<i class="bi bi-bag-plus"></i><span>Comprar</span>';
    button.addEventListener('click', () => addToCart(item.id));

    body.appendChild(name);
    body.appendChild(price);
    body.appendChild(button);

    card.appendChild(media);
    card.appendChild(body);

    return card;
}

function displayItems() {
    GRIDS.forEach(({ id, category }) => {
        const grid = document.getElementById(id);
        if (!grid) return;

        const fragment = document.createDocumentFragment();
        produtos
            .filter((item) => item.category === category)
            .forEach((item) => fragment.appendChild(createCard(item)));

        grid.appendChild(fragment);
    });
}

function selectTaste() {
    const header = document.querySelector('.category-header');
    if (!header) return;

    const categorias = [...new Map(produtos.map((item) => [item.category, item])).values()];

    categorias.forEach((item) => {
        const listCard = document.createElement('a');
        listCard.className = 'list-card';
        listCard.href = '#' + item.category;

        const listImg = document.createElement('img');
        listImg.src = item.img;
        listImg.alt = item.category;
        listImg.loading = 'lazy';

        const listName = document.createElement('span');
        listName.className = 'list-name';
        listName.innerText = item.category;

        listCard.appendChild(listImg);
        listCard.appendChild(listName);
        header.appendChild(listCard);
    });
}

/* ---------------------------------------------------------------- carrinho */

let cartData = [];

function findProduct(id) {
    return produtos.find((item) => String(item.id) === String(id));
}

function setButtonState(id, added) {
    const button = document.querySelector('.add-to-cart[data-id="' + id + '"]');
    if (!button) return;

    button.classList.toggle('ativo', added);
    button.innerHTML = added
        ? '<i class="bi bi-check2"></i><span>Adicionado</span>'
        : '<i class="bi bi-bag-plus"></i><span>Comprar</span>';
}

function addToCart(id) {
    const produto = findProduct(id);
    if (!produto) return;

    const linha = cartData.find((item) => item.id === produto.id);

    if (linha) {
        linha.quantity += 1;
    } else {
        cartData.push({
            id: produto.id,
            img: produto.img,
            nome: produto.nome,
            unitPrice: produto.price,
            quantity: 1,
        });
        setButtonState(produto.id, true);
    }

    if (typeof window.abrirCarrinho === 'function') window.abrirCarrinho();
    renderCart();
}

function removeFromCart(id) {
    cartData = cartData.filter((item) => item.id !== id);
    setButtonState(id, false);
    renderCart();
}

function changeQuantity(id, delta) {
    const linha = cartData.find((item) => item.id === id);
    if (!linha) return;

    if (linha.quantity + delta <= 0) {
        removeFromCart(id);
        return;
    }

    linha.quantity += delta;
    renderCart();
}

function createCartRow(item) {
    const row = document.createElement('div');
    row.className = 'lista';

    const thumb = document.createElement('div');
    thumb.className = 'listaImg';
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.nome;
    thumb.appendChild(img);

    const info = document.createElement('div');
    info.className = 'listaInfo';

    const nome = document.createElement('p');
    nome.className = 'listaNome';
    nome.innerText = item.nome;

    const unitario = document.createElement('p');
    unitario.className = 'listaUnitario';
    unitario.innerText = BRL.format(item.unitPrice) + ' / un.';

    const btns = document.createElement('div');
    btns.className = 'btns';

    const menos = document.createElement('button');
    menos.className = 'decrease-item';
    menos.type = 'button';
    menos.setAttribute('aria-label', 'Diminuir quantidade');
    menos.innerHTML = '<i class="bi bi-dash"></i>';
    menos.addEventListener('click', () => changeQuantity(item.id, -1));

    const quantidade = document.createElement('span');
    quantidade.innerText = item.quantity;

    const mais = document.createElement('button');
    mais.className = 'increase-item';
    mais.type = 'button';
    mais.setAttribute('aria-label', 'Aumentar quantidade');
    mais.innerHTML = '<i class="bi bi-plus"></i>';
    mais.addEventListener('click', () => changeQuantity(item.id, 1));

    btns.appendChild(menos);
    btns.appendChild(quantidade);
    btns.appendChild(mais);

    info.appendChild(nome);
    info.appendChild(unitario);
    info.appendChild(btns);

    const lado = document.createElement('div');
    lado.className = 'listaLado';

    const preco = document.createElement('p');
    preco.className = 'precoItem';
    preco.innerText = BRL.format(item.unitPrice * item.quantity);

    const remover = document.createElement('button');
    remover.className = 'remove-item';
    remover.type = 'button';
    remover.setAttribute('aria-label', 'Remover ' + item.nome);
    remover.innerHTML = '<i class="bi bi-trash3"></i>';
    remover.addEventListener('click', () => removeFromCart(item.id));

    lado.appendChild(preco);
    lado.appendChild(remover);

    row.appendChild(thumb);
    row.appendChild(info);
    row.appendChild(lado);

    return row;
}

function renderCart() {
    const tableBody = document.getElementById('table-body');
    const empty = document.getElementById('cart-empty');
    const badge = document.getElementById('cart-plus');
    const botaoFinal = document.querySelector('.btnFinal');

    tableBody.innerHTML = '';
    cartData.forEach((item) => tableBody.appendChild(createCartRow(item)));

    const quantidade = cartData.reduce((acc, item) => acc + item.quantity, 0);
    const total = cartData.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    if (empty) empty.classList.toggle('ativo', cartData.length === 0);
    if (botaoFinal) botaoFinal.disabled = cartData.length === 0;

    badge.innerText = quantidade;
    badge.classList.toggle('ativo', quantidade > 0);

    document.getElementById('total-item').innerText =
        quantidade === 1 ? '1 item' : quantidade + ' itens';
    document.getElementById('total-price').innerText = BRL.format(total);
}

displayItems();
selectTaste();
renderCart();
