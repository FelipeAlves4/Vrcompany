const listaProdutos = [
    {
        id: 1,
        nome: "Camiseta Preta",
        preco: 79.9,
        imagem: "img/1.jpg",
        descricao: "Camiseta premium com tecido macio, caimento moderno e visual minimalista para combinar com qualquer look urbano.",
        tamanhos: "P, M, G, GG",
        composicao: "100% algodao penteado",
        categoria: "Camisetas"
    },
    {
        id: 2,
        nome: "Moletom",
        preco: 149.9,
        imagem: "img/2.jpg",
        descricao: "Moletom encorpado com toque confortavel, ideal para dias frios mantendo estilo street e acabamento de alta qualidade.",
        tamanhos: "M, G, GG",
        composicao: "50% algodao, 50% poliester",
        categoria: "Moletons"
    },
    {
        id: 3,
        nome: "Camiseta Azul",
        preco: 69.9,
        imagem: "img/3.jpg",
        descricao: "Camiseta azul com modelagem casual e respiravel. Peca versatil para uso diario com identidade forte.",
        tamanhos: "P, M, G",
        composicao: "100% algodao",
        categoria: "Camisetas"
    }
];

const formatoPreco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const params = new URLSearchParams(window.location.search);
const produtoId = Number(params.get("id"));
const produto = listaProdutos.find(item => item.id === produtoId);
const container = document.getElementById("produtoDetalhe");
let timeoutToast;

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    clearTimeout(timeoutToast);
    toast.textContent = mensagem;
    toast.classList.add("show");
    timeoutToast = setTimeout(() => toast.classList.remove("show"), 2200);
}

function adicionarAoCarrinho(produtoSelecionado) {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.push({
        id: produtoSelecionado.id,
        nome: produtoSelecionado.nome,
        preco: produtoSelecionado.preco,
        imagem: produtoSelecionado.imagem
    });
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    mostrarToast("Produto adicionado ao carrinho.");
}

function montarLinkWhatsApp(produtoSelecionado) {
    const numero = "5514998681929";
    const texto = `Ola! Tenho interesse no produto: ${produtoSelecionado.nome} (${formatoPreco.format(produtoSelecionado.preco)}).`;
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

function renderRelacionados(produtoAtual) {
    const relacionados = document.getElementById("relacionados");
    if (!relacionados) return;

    const lista = listaProdutos.filter(item => item.id !== produtoAtual.id).slice(0, 2);
    relacionados.innerHTML = `
      <h3>Produtos relacionados</h3>
      <div class="related-grid">
        ${lista.map(item => `
          <article class="related-card">
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="info">
              <h4>${item.nome}</h4>
              <p>${formatoPreco.format(item.preco)}</p>
              <a href="produto.html?id=${item.id}">Ver produto</a>
            </div>
          </article>
        `).join("")}
      </div>
    `;
}

if (!produto) {
    container.innerHTML = `
      <div class="erro">
        <h2>Produto nao encontrado</h2>
        <p>Esse produto nao existe mais ou o link esta incorreto.</p>
        <a class="back-btn" href="index.html">Voltar para a loja</a>
      </div>
    `;
} else {
    document.title = `${produto.nome} | VR Company`;
    container.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <div class="produto-info">
        <h1>${produto.nome}</h1>
        <p class="preco">${formatoPreco.format(produto.preco)}</p>
        <p class="descricao">${produto.descricao}</p>
        <div class="meta">
          <div><strong>Categoria:</strong> ${produto.categoria}</div>
          <div><strong>Tamanhos:</strong> ${produto.tamanhos}</div>
          <div><strong>Composicao:</strong> ${produto.composicao}</div>
        </div>
        <div class="acoes">
          <button id="btnComprar">Adicionar ao carrinho</button>
          <a class="btn-zap" href="${montarLinkWhatsApp(produto)}" target="_blank" rel="noopener noreferrer">
            Comprar direto no WhatsApp
          </a>
        </div>
      </div>
    `;

    document.getElementById("btnComprar").addEventListener("click", () => {
        adicionarAoCarrinho(produto);
    });

    renderRelacionados(produto);
}
