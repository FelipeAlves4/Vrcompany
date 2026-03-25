const PRODUTOS_CHAVE = "produtosLoja";

const PRODUTOS_INICIAIS = [
    {
        id: 1,
        nome: "Camiseta Preta",
        preco: 79.9,
        imagem: "img/1.jpg",
        categoria: "Camisetas",
        descricao: "Camiseta premium com tecido macio e caimento moderno para o dia a dia.",
        tamanhos: "P, M, G, GG",
        composicao: "100% algodao penteado",
        sku: "VR-CAM-001",
        estoque: 12,
        destaque: true,
        ativo: true
    },
    {
        id: 2,
        nome: "Moletom",
        preco: 149.9,
        imagem: "img/2.jpg",
        categoria: "Moletons",
        descricao: "Moletom encorpado com toque confortavel e estilo urbano.",
        tamanhos: "M, G, GG",
        composicao: "50% algodao, 50% poliester",
        sku: "VR-MOL-002",
        estoque: 8,
        destaque: false,
        ativo: true
    },
    {
        id: 3,
        nome: "Camiseta Azul",
        preco: 69.9,
        imagem: "img/3.jpg",
        categoria: "Camisetas",
        descricao: "Camiseta azul com modelagem casual e visual versatil.",
        tamanhos: "P, M, G",
        composicao: "100% algodao",
        sku: "VR-CAM-003",
        estoque: 15,
        destaque: true,
        ativo: true
    }
];

function normalizarProduto(produto) {
    return {
        id: Number(produto.id),
        nome: produto.nome || "",
        preco: Number(produto.preco) || 0,
        imagem: produto.imagem || "",
        categoria: produto.categoria || "Geral",
        descricao: produto.descricao || "",
        tamanhos: produto.tamanhos || "Unico",
        composicao: produto.composicao || "-",
        sku: produto.sku || "",
        estoque: Number.isFinite(Number(produto.estoque)) ? Number(produto.estoque) : 0,
        destaque: Boolean(produto.destaque),
        ativo: produto.ativo !== false
    };
}

function obterProdutos() {
    const salvos = JSON.parse(localStorage.getItem(PRODUTOS_CHAVE));
    if (!Array.isArray(salvos) || salvos.length === 0) {
        localStorage.setItem(PRODUTOS_CHAVE, JSON.stringify(PRODUTOS_INICIAIS));
        return [...PRODUTOS_INICIAIS];
    }
    return salvos.map(normalizarProduto);
}

function salvarProdutos(lista) {
    localStorage.setItem(PRODUTOS_CHAVE, JSON.stringify(lista));
}

function adicionarProduto(produto) {
    const produtos = obterProdutos();
    const novoId = produtos.length ? Math.max(...produtos.map(item => item.id)) + 1 : 1;
    const novoProduto = normalizarProduto({ ...produto, id: novoId });
    produtos.push(novoProduto);
    salvarProdutos(produtos);
    return novoProduto;
}

function removerProduto(id) {
    const produtos = obterProdutos().filter(item => item.id !== id);
    salvarProdutos(produtos);
}

function atualizarProduto(id, dadosAtualizados) {
    const produtos = obterProdutos();
    const indice = produtos.findIndex(item => item.id === id);
    if (indice === -1) return null;
    const atualizado = normalizarProduto({ ...produtos[indice], ...dadosAtualizados, id });
    produtos[indice] = atualizado;
    salvarProdutos(produtos);
    return atualizado;
}
