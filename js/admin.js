const formProduto = document.getElementById("formProduto");
const listaProdutosEl = document.getElementById("listaProdutos");
const resetarBtn = document.getElementById("resetar");
const exportarJsonBtn = document.getElementById("exportarJson");
const importarJsonInput = document.getElementById("importarJson");
const buscaAdmin = document.getElementById("buscaAdmin");
const filtroStatus = document.getElementById("filtroStatus");
const statsGrid = document.getElementById("statsGrid");
const btnCancelarEdicao = document.getElementById("btnCancelarEdicao");
const modoFormulario = document.getElementById("modoFormulario");
const formatoPreco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
let timeoutToast;

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    clearTimeout(timeoutToast);
    toast.textContent = mensagem;
    toast.classList.add("show");
    timeoutToast = setTimeout(() => toast.classList.remove("show"), 2200);
}

function atualizarDashboard(produtos) {
    const ativos = produtos.filter(item => item.ativo).length;
    const inativos = produtos.filter(item => !item.ativo).length;
    const semEstoque = produtos.filter(item => (item.estoque || 0) <= 0).length;
    const valorEstoque = produtos.reduce((acc, item) => acc + ((item.estoque || 0) * item.preco), 0);

    statsGrid.innerHTML = `
      <article class="stat-card"><p>Total de produtos</p><strong>${produtos.length}</strong></article>
      <article class="stat-card"><p>Produtos ativos</p><strong>${ativos}</strong></article>
      <article class="stat-card"><p>Produtos inativos</p><strong>${inativos}</strong></article>
      <article class="stat-card"><p>Sem estoque</p><strong>${semEstoque}</strong></article>
      <article class="stat-card"><p>Valor estimado em estoque</p><strong>${formatoPreco.format(valorEstoque)}</strong></article>
    `;
}

function filtrarProdutos(produtos) {
    const termo = (buscaAdmin.value || "").trim().toLowerCase();
    const status = filtroStatus.value;

    return produtos.filter(item => {
        const bateBusca = !termo
            || item.nome.toLowerCase().includes(termo)
            || item.categoria.toLowerCase().includes(termo)
            || (item.sku || "").toLowerCase().includes(termo);

        const bateStatus = status === "todos"
            || (status === "ativos" && item.ativo)
            || (status === "inativos" && !item.ativo)
            || (status === "sem-estoque" && (item.estoque || 0) <= 0);

        return bateBusca && bateStatus;
    });
}

function entrarModoCriacao() {
    formProduto.reset();
    document.getElementById("produtoId").value = "";
    document.getElementById("ativo").checked = true;
    modoFormulario.textContent = "Modo: Novo produto";
    document.getElementById("btnSalvar").textContent = "Publicar produto";
}

function preencherFormulario(produto) {
    document.getElementById("produtoId").value = produto.id;
    document.getElementById("nome").value = produto.nome;
    document.getElementById("sku").value = produto.sku || "";
    document.getElementById("preco").value = produto.preco;
    document.getElementById("categoria").value = produto.categoria;
    document.getElementById("imagem").value = produto.imagem;
    document.getElementById("estoque").value = produto.estoque || 0;
    document.getElementById("tamanhos").value = produto.tamanhos;
    document.getElementById("composicao").value = produto.composicao;
    document.getElementById("descricao").value = produto.descricao;
    document.getElementById("destaque").checked = Boolean(produto.destaque);
    document.getElementById("ativo").checked = Boolean(produto.ativo);
    modoFormulario.textContent = `Modo: Editando #${produto.id}`;
    document.getElementById("btnSalvar").textContent = "Salvar alteracoes";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderLista() {
    const produtos = obterProdutos();
    const produtosFiltrados = filtrarProdutos(produtos);
    atualizarDashboard(produtos);

    if (!produtosFiltrados.length) {
        listaProdutosEl.innerHTML = "<p>Nenhum produto cadastrado.</p>";
        return;
    }

    listaProdutosEl.innerHTML = produtosFiltrados.map(item => `
      <article class="item">
        <div>
          <h4>${item.nome} - ${formatoPreco.format(item.preco)}</h4>
          <p>${item.categoria} | SKU: ${item.sku || "-"} | Estoque: ${item.estoque || 0}</p>
          <div class="meta">
            <span class="chip ${item.ativo ? "active" : "inactive"}">${item.ativo ? "Ativo" : "Inativo"}</span>
            ${item.destaque ? '<span class="chip">Destaque</span>' : ""}
          </div>
        </div>
        <div class="item-actions">
          <button class="btn-edit" data-edit-id="${item.id}">Editar</button>
          <button class="btn-delete" data-delete-id="${item.id}">Excluir</button>
        </div>
      </article>
    `).join("");

    listaProdutosEl.querySelectorAll("button[data-delete-id]").forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.deleteId);
            removerProduto(id);
            renderLista();
            mostrarToast("Produto removido.");
        });
    });

    listaProdutosEl.querySelectorAll("button[data-edit-id]").forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.editId);
            const produto = obterProdutos().find(item => item.id === id);
            if (!produto) return;
            preencherFormulario(produto);
        });
    });
}

formProduto.addEventListener("submit", (event) => {
    event.preventDefault();

    const idEdicao = Number(document.getElementById("produtoId").value);
    const produtoForm = {
        nome: document.getElementById("nome").value.trim(),
        sku: document.getElementById("sku").value.trim(),
        preco: Number(document.getElementById("preco").value),
        categoria: document.getElementById("categoria").value.trim(),
        imagem: document.getElementById("imagem").value.trim(),
        estoque: Number(document.getElementById("estoque").value),
        tamanhos: document.getElementById("tamanhos").value.trim(),
        composicao: document.getElementById("composicao").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        destaque: document.getElementById("destaque").checked,
        ativo: document.getElementById("ativo").checked
    };

    if (!produtoForm.nome || !produtoForm.categoria || !produtoForm.imagem || !produtoForm.descricao || !produtoForm.sku) {
        mostrarToast("Preencha todos os campos obrigatorios.");
        return;
    }

    if (!Number.isFinite(produtoForm.preco) || produtoForm.preco <= 0) {
        mostrarToast("Digite um preco valido.");
        return;
    }

    if (!Number.isFinite(produtoForm.estoque) || produtoForm.estoque < 0) {
        mostrarToast("Estoque invalido.");
        return;
    }

    if (idEdicao) {
        atualizarProduto(idEdicao, produtoForm);
        mostrarToast("Produto atualizado com sucesso.");
    } else {
        adicionarProduto(produtoForm);
        mostrarToast("Produto publicado com sucesso.");
    }

    entrarModoCriacao();
    renderLista();
});

resetarBtn.addEventListener("click", () => {
    salvarProdutos(PRODUTOS_INICIAIS);
    entrarModoCriacao();
    renderLista();
    mostrarToast("Catalogo restaurado para o padrao.");
});

btnCancelarEdicao.addEventListener("click", () => {
    entrarModoCriacao();
});

buscaAdmin.addEventListener("input", renderLista);
filtroStatus.addEventListener("change", renderLista);

exportarJsonBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(obterProdutos(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "catalogo-vr-company.json";
    link.click();
    URL.revokeObjectURL(url);
    mostrarToast("Catalogo exportado.");
});

importarJsonInput.addEventListener("change", async (event) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    try {
        const texto = await arquivo.text();
        const dados = JSON.parse(texto);
        if (!Array.isArray(dados)) throw new Error("Formato invalido");
        salvarProdutos(dados);
        entrarModoCriacao();
        renderLista();
        mostrarToast("Catalogo importado com sucesso.");
    } catch {
        mostrarToast("Falha ao importar JSON.");
    } finally {
        importarJsonInput.value = "";
    }
});

entrarModoCriacao();
renderLista();
