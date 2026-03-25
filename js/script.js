const produtos = [
    { id: 1, nome: "Camiseta Preta", preco: 79.90, imagem: "img/1.jpg", categoria: "Camisetas" },
    { id: 2, nome: "Moletom", preco: 149.90, imagem: "img/2.jpg", categoria: "Moletons" },
    { id: 3, nome: "Camiseta Azul", preco: 69.90, imagem: "img/3.jpg", categoria: "Camisetas" }
];

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
const formatoPreco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const banners = ["img/banner.jpg", "img/banner2.png", "img/banner3.png"];
let bannerAtual = 0;
let intervaloBanner;
let timeoutToast;

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    clearTimeout(timeoutToast);
    toast.textContent = mensagem;
    toast.classList.add("show");

    timeoutToast = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

function getProdutosFiltrados() {
    const busca = document.getElementById("buscaProduto")?.value.trim().toLowerCase() || "";
    const categoria = document.getElementById("filtroCategoria")?.value || "todos";
    const ordenacao = document.getElementById("ordenacaoPreco")?.value || "relevancia";

    let lista = [...produtos].filter(item => {
        const atendeBusca = item.nome.toLowerCase().includes(busca);
        const atendeCategoria = categoria === "todos" || item.categoria === categoria;
        return atendeBusca && atendeCategoria;
    });

    if (ordenacao === "menor-preco") {
        lista.sort((a, b) => a.preco - b.preco);
    }

    if (ordenacao === "maior-preco") {
        lista.sort((a, b) => b.preco - a.preco);
    }

    return lista;
}

// Mostrar produtos
function mostrarProdutos() {
    const container = document.getElementById("produtos");
    container.innerHTML = "";
    const lista = getProdutosFiltrados();

    if (lista.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum produto encontrado com os filtros selecionados.</p>';
        return;
    }

    lista.forEach(p => {
        container.innerHTML += `
      <div class="card">
        <img src="${p.imagem}" alt="${p.nome}">
        <div class="card-content">
          <h3>${p.nome}</h3>
          <p class="price">${formatoPreco.format(p.preco)}</p>
          <div class="card-actions">
            <a class="btn-link" href="produto.html?id=${p.id}">Ver detalhes</a>
            <button onclick="addCarrinho(${p.id})">Comprar</button>
          </div>
        </div>
      </div>
    `;
    });
}

// Carrinho
function addCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    carrinho.push(produto);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarContador();
    mostrarToast(`${produto.nome} adicionado ao carrinho.`);
}

function atualizarContador() {
    document.getElementById("contador").innerText = carrinho.length;
}

// Modal
function abrirCarrinho() {
    document.getElementById("carrinhoModal").style.display = "block";
    renderCarrinho();
}

function fecharCarrinho() {
    document.getElementById("carrinhoModal").style.display = "none";
}

function renderCarrinho() {
    const div = document.getElementById("itensCarrinho");
    div.innerHTML = "";

    let total = 0;

    if (carrinho.length === 0) {
        div.innerHTML = "<p>Seu carrinho ainda esta vazio.</p>";
        document.getElementById("total").innerText = "";
        return;
    }

    carrinho.forEach(item => {
        div.innerHTML += `<p>${item.nome} - ${formatoPreco.format(item.preco)}</p>`;
        total += item.preco;
    });

    document.getElementById("total").innerText = "Total: " + formatoPreco.format(total);
}

// WhatsApp
function enviarPedidoWhatsApp() {
    const numero = "5514998681929"; // TROCAR

    if (carrinho.length === 0) {
        mostrarToast("Carrinho vazio.");
        return;
    }

    let mensagem = "🛒 *Pedido VR Company*%0A%0A";
    let total = 0;

    carrinho.forEach(item => {
        mensagem += `• ${item.nome} - ${formatoPreco.format(item.preco)}%0A`;
        total += item.preco;
    });

    mensagem += `%0A💰 Total: ${formatoPreco.format(total)}`;

    window.open(`https://wa.me/${numero}?text=${mensagem}`);

    localStorage.removeItem("carrinho");
    carrinho = [];
    atualizarContador();
    fecharCarrinho();
    mostrarToast("Pedido enviado para o WhatsApp.");
}

// Scroll
function scrollParaProdutos() {
    document.getElementById("produtos").scrollIntoView({ behavior: "smooth" });
}

function atualizarIndicadoresBanner() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === bannerAtual);
    });
}

function trocarBanner(index) {
    const heroBg = document.getElementById("heroBg");
    bannerAtual = index;
    heroBg.classList.add("fade");

    setTimeout(() => {
        heroBg.style.backgroundImage = `url('${banners[bannerAtual]}')`;
        heroBg.classList.remove("fade");
    }, 250);

    atualizarIndicadoresBanner();
}

function iniciarBannerRotativo() {
    if (!document.getElementById("heroBg")) return;

    trocarBanner(0);
    clearInterval(intervaloBanner);

    intervaloBanner = setInterval(() => {
        const proximo = (bannerAtual + 1) % banners.length;
        trocarBanner(proximo);
    }, 5000);
}

window.onclick = function (event) {
    const modal = document.getElementById("carrinhoModal");
    if (event.target === modal) {
        fecharCarrinho();
    }
};

function iniciarControlesCatalogo() {
    const busca = document.getElementById("buscaProduto");
    const categoria = document.getElementById("filtroCategoria");
    const ordenacao = document.getElementById("ordenacaoPreco");

    [busca, categoria, ordenacao].forEach(controle => {
        if (!controle) return;
        controle.addEventListener("input", mostrarProdutos);
        controle.addEventListener("change", mostrarProdutos);
    });
}

// Init
iniciarControlesCatalogo();
mostrarProdutos();
atualizarContador();
iniciarBannerRotativo();