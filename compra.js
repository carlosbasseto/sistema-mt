const produtos = [];

// Função para salvar um produto
function saveProduct() {
    const codigo = document.getElementById('codigo').value;
    const descricao = document.getElementById('descricao').value;
    const valorPrazo = parseFloat(document.getElementById('valorPrazo').value);
    const valorVista = parseFloat(document.getElementById('valorVista').value);
    const quantidade = parseInt(document.getElementById('quantidade').value);

    const produto = { codigo, descricao, valorPrazo, valorVista, quantidade };
    produtos.push(produto);
    updateProductList(); // Atualiza a lista de produtos cadastrados
    loadProductsToPurchase(); // Atualiza a lista de produtos na seção de compra
    document.getElementById('productForm').reset(); // Limpa o formulário
}

// Função para atualizar a lista de produtos
function updateProductList() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    produtos.forEach(produto => {
        const li = document.createElement('li');
        li.textContent = `${produto.descricao} - R$ ${produto.valorVista.toFixed(2)} (Código: ${produto.codigo})`;
        productList.appendChild(li);
    });
}

// Função para carregar produtos na tela de compra
function loadProductsToPurchase() {
    const produtoSelecionado = document.getElementById('produtoSelecionado');
    produtoSelecionado.innerHTML = ''; // Limpa as opções antes de carregar novamente

    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.codigo; // Utilize o código como valor da opção
        option.textContent = produto.descricao;
        produtoSelecionado.appendChild(option);
    });
}

// Função para carregar informações do produto selecionado
function carregarProdutoSelecionado() {
    const produtoSelecionado = document.getElementById('produtoSelecionado');
    const produtoInfo = document.getElementById('produtoInfo');
    const selectedCodigo = produtoSelecionado.value;

    // Limpa informações do produto anterior
    produtoInfo.innerHTML = '';

    const produto = produtos.find(p => p.codigo === selectedCodigo);
    if (produto) {
        produtoInfo.innerHTML = `
            <p><strong>Descrição:</strong> ${produto.descricao}</p>
            <p><strong>Preço à Vista:</strong> R$ ${produto.valorVista.toFixed(2)}</p>
            <p><strong>Quantidade Disponível:</strong> ${produto.quantidade}</p>
        `;
    }
}

// Variável total
let total = 0;

// Função para adicionar produto à compra
function adicionarProduto() {
    const produtoSelecionado = document.getElementById('produtoSelecionado');
    const selectedCodigo = produtoSelecionado.value;
    const produto = produtos.find(p => p.codigo === selectedCodigo);

    if (produto) {
        const quantidadeAdicionada = prompt("Quantos itens você deseja adicionar? (Disponível: " + produto.quantidade + ")");
        const quantidade = parseInt(quantidadeAdicionada);

        if (quantidade > 0 && quantidade <= produto.quantidade) {
            const itens = document.getElementById('itens');
            const novaLinha = document.createElement('tr');
            novaLinha.innerHTML = `
                <td>${produto.descricao}</td>
                <td>R$ ${produto.valorVista.toFixed(2)}</td>
                <td>${quantidade}</td>
                <td><button onclick="removerProduto(this, ${produto.valorVista * quantidade})">Remover</button></td>
            `;
            itens.appendChild(novaLinha);

            total += produto.valorVista * quantidade;
            document.getElementById('total').innerText = total.toFixed(2);

            // Atualiza a quantidade disponível do produto
            produto.quantidade -= quantidade;

            // Opcional: Limpa a seleção após adicionar
            produtoSelecionado.value = '';
            document.getElementById('produtoInfo').innerHTML = ''; // Limpa as informações do produto
            updateProductList(); // Atualiza a lista de produtos após a adição
        } else {
            alert("Quantidade inválida!");
        }
    } else {
        alert("Selecione um produto válido!");
    }
}

// Função para remover produto da compra
function removerProduto(botao, preco) {
    const linha = botao.parentElement.parentElement;
    linha.remove();
    total -= preco;
    document.getElementById('total').innerText = total.toFixed(2);
}

// Função para finalizar compra e carregar informações dos produtos na lista de produtos
function finalizarCompra() {
    const itens = document.getElementById('itens').children;
    for (let i = 0; i < itens.length; i++) {
        const produtoDescricao = itens[i].children[0].innerText;
        const produto = produtos.find(p => p.descricao === produtoDescricao);
        if (produto) {
            console.log(`Produto: ${produto.descricao}, Preço: ${produto.valorVista}, Quantidade: ${itens[i].children[2].innerText}`);
        }
    }
    alert("Compra finalizada!");
}
