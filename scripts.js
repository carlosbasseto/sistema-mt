// Helper function to get data from localStorage
function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Helper function to save data to localStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Initialize products and clients
let products = getFromLocalStorage('products');
let clients = getFromLocalStorage('clients');

// Função para salvar produtos no localStorage
function saveProduct() {
    const codigo = document.getElementById('codigo').value;
    const descricao = document.getElementById('descricao').value;
    const valorPrazo = document.getElementById('valorPrazo').value;
    const valorVista = document.getElementById('valorVista').value;
    const quantidade = document.getElementById('quantidade').value;

    // Validação de campos
    if (!codigo || !descricao || !valorPrazo || !valorVista || !quantidade) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Verifica se o produto já existe pelo código
    const existingProductIndex = products.findIndex(p => p.codigo === codigo);
    if (existingProductIndex >= 0) {
        // Atualiza o produto existente
        products[existingProductIndex] = { codigo, descricao, valorPrazo, valorVista, quantidade };
    } else {
        // Adiciona um novo produto
        products.push({ codigo, descricao, valorPrazo, valorVista, quantidade });
    }
    
    // Salva no localStorage
    saveToLocalStorage('products', products);

    alert('Produto salvo com sucesso!');
    document.getElementById('productForm').reset();
    updateProductList();  // Atualiza a lista de produtos
}

// Função para atualizar a lista de produtos
function updateProductList() {
    const search = document.getElementById('searchProduct').value.toLowerCase();
    const productList = document.getElementById('productList');
    productList.innerHTML = '';  // Limpa a lista antes de preencher

    products
        .filter(product => product.descricao.toLowerCase().includes(search))
        .forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.descricao} - Código: ${product.codigo} - Valor a Prazo: R$ ${parseFloat(product.valorPrazo).toFixed(2)} - Valor à Vista: R$ ${parseFloat(product.valorVista).toFixed(2)} - Quantidade: ${product.quantidade}`;
            
            // Cria botão de excluir
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => deleteProduct(product.codigo);
            
            li.appendChild(deleteButton);
            productList.appendChild(li);
        });
}

// Função para deletar produto
function deleteProduct(codigo) {
    if (confirm('Você tem certeza que deseja excluir este produto?')) {
        products = products.filter(product => product.codigo !== codigo);
        saveToLocalStorage('products', products);
        updateProductList();  // Atualiza a lista após exclusão
    }
}

// Função para selecionar produto na venda e exibir detalhes (exceto quantidade)
function selectProduct(product) {
    document.getElementById('produtoDisplay').value = product.descricao;
    document.getElementById('produto').value = product.codigo;
    fillProductDetails(product); // Preenche os detalhes do produto, exceto quantidade
    closeProductModal();
}

// Função para preencher os detalhes do produto na venda (exceto quantidade)
function fillProductDetails(product) {
    document.getElementById('detailCodigo').textContent = product.codigo;
    document.getElementById('detailDescricao').textContent = product.descricao;
    document.getElementById('detailValorPrazo').textContent = `R$ ${parseFloat(product.valorPrazo).toFixed(2)}`;
    document.getElementById('detailValorVista').textContent = `R$ ${parseFloat(product.valorVista).toFixed(2)}`;
    // Não exibe a quantidade aqui, o usuário define a quantidade a ser vendida
}

// Função para abrir modal de produtos na venda
function openProductModal() {
    const modal = document.getElementById('productModal');
    const modalProductList = document.getElementById('modalProductList');
    modalProductList.innerHTML = ''; // Limpa o conteúdo anterior

    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.descricao} - Código: ${product.codigo}`;
        li.onclick = () => selectProduct(product);
        modalProductList.appendChild(li);
    });

    modal.style.display = 'block';
}

// Função para fechar o modal de produtos
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Função para finalizar a venda
function finalizeSale() {
    const quantidade = document.getElementById('quantidade').value;
    
    if (!quantidade || quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }
    
    alert('Venda concluída com sucesso!');
    window.location.href = 'recebimento.html';
}

// Popula a lista de produtos e clientes na tela de venda
function populateSelects() {
    const clientSelect = document.getElementById('cliente');
    const productSelect = document.getElementById('produto');

    clientSelect.innerHTML = '';
    productSelect.innerHTML = '';

    // Popula clientes no select (exemplo)
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.nome;
        option.textContent = client.nome;
        clientSelect.appendChild(option);
    });

    // Popula produtos no select
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.codigo;
        option.textContent = `${product.descricao} - Código: ${product.codigo}`;
        productSelect.appendChild(option);
    });
}

// Evento que atualiza a lista de produtos ao carregar a página
window.addEventListener('load', () => {
    updateProductList();
    populateSelects();
});
