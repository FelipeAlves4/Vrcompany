const produtos = [
    {
        id: 1,
        nome: "Camiseta VR Preta",
        preco: 79.90,
        imagem: "img/j1.png"
    },
    {
        id: 2,
        nome: "Moletom VR",
        preco: 149.90,
        imagem: "img/j2.png"
    },
    {
        id: 3,
        nome: "Tenis VR",
        preco: 69.90,
        imagem: "img/j3.png"
    }
];

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function atualizarContador() {
    document.getElementById("contador").innerText = carrinho.length;
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);

    carrinho.push(produto);

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    atualizarContador();
}

function mostrarProdutos() {
    const container = document.getElementById("produtos");

    produtos.forEach(produto => {
        container.innerHTML += `
      <div class="card">
        <img src="${produto.imagem}">
        <div class="card-content">
          <h3>${produto.nome}</h3>
          <p>R$ ${produto.preco}</p>
          <button onclick="adicionarAoCarrinho(${produto.id})">
            Comprar
          </button>
        </div>
      </div>
    `;
    });
}

mostrarProdutos();
atualizarContador();