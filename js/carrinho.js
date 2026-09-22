import { produtos } from './produtos.js';
import { BRL } from './formato.js';

// cada linha do carrinho guarda uma copia do produto com o preco unitario
// separado da quantidade, pra nunca alterar o catalogo original
let carrinho = [];

function buscarProduto(id) {
    return produtos.find((item) => String(item.id) === String(id));
}

function estadoDoBotao(id, adicionado) {
    const botao = document.querySelector('.add-to-cart[data-id="' + id + '"]');
    if (!botao) return;

    botao.classList.toggle('ativo', adicionado);
    botao.innerHTML = adicionado
        ? '<i class="bi bi-check2"></i><span>Adicionado</span>'
        : '<i class="bi bi-bag-plus"></i><span>Comprar</span>';
}

export function adicionarAoCarrinho(id) {
    const produto = buscarProduto(id);
    if (!produto) return;

    const linha = carrinho.find((item) => item.id === produto.id);

    if (linha) {
        linha.quantidade += 1;
    } else {
        carrinho.push({
            id: produto.id,
            img: produto.img,
            nome: produto.nome,
            precoUnitario: produto.price,
            quantidade: 1,
        });
        estadoDoBotao(produto.id, true);
    }

    if (typeof window.abrirCarrinho === 'function') window.abrirCarrinho();
    atualizarCarrinho();
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter((item) => item.id !== id);
    estadoDoBotao(id, false);
    atualizarCarrinho();
}

function mudarQuantidade(id, passo) {
    const linha = carrinho.find((item) => item.id === id);
    if (!linha) return;

    if (linha.quantidade + passo <= 0) {
        removerDoCarrinho(id);
        return;
    }

    linha.quantidade += passo;
    atualizarCarrinho();
}

function criarLinha(item) {
    const linha = document.createElement('div');
    linha.className = 'lista';

    const foto = document.createElement('div');
    foto.className = 'listaImg';
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.nome;
    foto.appendChild(img);

    const info = document.createElement('div');
    info.className = 'listaInfo';

    const nome = document.createElement('p');
    nome.className = 'listaNome';
    nome.innerText = item.nome;

    const unitario = document.createElement('p');
    unitario.className = 'listaUnitario';
    unitario.innerText = BRL.format(item.precoUnitario) + ' / un.';

    const botoes = document.createElement('div');
    botoes.className = 'btns';

    const menos = document.createElement('button');
    menos.className = 'decrease-item';
    menos.type = 'button';
    menos.setAttribute('aria-label', 'Diminuir quantidade');
    menos.innerHTML = '<i class="bi bi-dash"></i>';
    menos.addEventListener('click', () => mudarQuantidade(item.id, -1));

    const quantidade = document.createElement('span');
    quantidade.innerText = item.quantidade;

    const mais = document.createElement('button');
    mais.className = 'increase-item';
    mais.type = 'button';
    mais.setAttribute('aria-label', 'Aumentar quantidade');
    mais.innerHTML = '<i class="bi bi-plus"></i>';
    mais.addEventListener('click', () => mudarQuantidade(item.id, 1));

    botoes.appendChild(menos);
    botoes.appendChild(quantidade);
    botoes.appendChild(mais);

    info.appendChild(nome);
    info.appendChild(unitario);
    info.appendChild(botoes);

    const lado = document.createElement('div');
    lado.className = 'listaLado';

    const preco = document.createElement('p');
    preco.className = 'precoItem';
    preco.innerText = BRL.format(item.precoUnitario * item.quantidade);

    const remover = document.createElement('button');
    remover.className = 'remove-item';
    remover.type = 'button';
    remover.setAttribute('aria-label', 'Remover ' + item.nome);
    remover.innerHTML = '<i class="bi bi-trash3"></i>';
    remover.addEventListener('click', () => removerDoCarrinho(item.id));

    lado.appendChild(preco);
    lado.appendChild(remover);

    linha.appendChild(foto);
    linha.appendChild(info);
    linha.appendChild(lado);

    return linha;
}

function atualizarCarrinho() {
    const corpo = document.getElementById('table-body');
    const vazio = document.getElementById('cart-empty');
    const contador = document.getElementById('cart-plus');
    const botaoFinal = document.querySelector('.btnFinal');

    corpo.innerHTML = '';
    carrinho.forEach((item) => corpo.appendChild(criarLinha(item)));

    const quantidade = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    const total = carrinho.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0);

    if (vazio) vazio.classList.toggle('ativo', carrinho.length === 0);
    if (botaoFinal) botaoFinal.disabled = carrinho.length === 0;

    contador.innerText = quantidade;
    contador.classList.toggle('ativo', quantidade > 0);

    document.getElementById('total-item').innerText =
        quantidade === 1 ? '1 item' : quantidade + ' itens';
    document.getElementById('total-price').innerText = BRL.format(total);
}

atualizarCarrinho();
