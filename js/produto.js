const listaProdutos = obterProdutos();
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
    if (produtoSelecionado.ativo === false || (produtoSelecionado.estoque || 0) <= 0) {
        mostrarToast("Produto indisponivel no momento.");
        return;
    }
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

if (!produto || produto.ativo === false) {
    container.innerHTML = `
      <div class="erro">
        <h2>Produto nao encontrado</h2>
        <p>Esse produto nao existe mais ou o link esta incorreto.</p>
        <a class="back-btn" href="index.html">Voltar para a loja</a>
      </div>
    `;
} else {
    const semEstoque = (produto.estoque || 0) <= 0;
    document.title = `${produto.nome} | VR Company`;
    container.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <div class="produto-info">
        <h1>${produto.nome}</h1>
        <p class="preco">${formatoPreco.format(produto.preco)}</p>
        <p class="descricao">${produto.descricao}</p>
        <div class="meta">
          <div><strong>SKU:</strong> ${produto.sku || "-"}</div>
          <div><strong>Categoria:</strong> ${produto.categoria}</div>
          <div><strong>Tamanhos:</strong> ${produto.tamanhos}</div>
          <div><strong>Composicao:</strong> ${produto.composicao}</div>
          <div><strong>Estoque:</strong> ${produto.estoque || 0}</div>
        </div>
        <div class="acoes">
          <button id="btnComprar" ${semEstoque ? "disabled" : ""}>${semEstoque ? "Indisponivel" : "Adicionar ao carrinho"}</button>
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
