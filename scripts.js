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

// Function to save products in localStorage
function saveProduct() {
    const codigo = document.getElementById('codigo').value;
    const descricao = document.getElementById('descricao').value;
    const valorPrazo = document.getElementById('valorPrazo').value;
    const valorVista = document.getElementById('valorVista').value;
    const quantidade = document.getElementById('quantidade').value;

    // Validate fields
    if (!codigo || !descricao || !valorPrazo || !valorVista || !quantidade) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Check if the product already exists by code
    const existingProductIndex = products.findIndex(p => p.codigo === codigo);
    if (existingProductIndex >= 0) {
        // Update the existing product
        products[existingProductIndex] = { codigo, descricao, valorPrazo, valorVista, quantidade };
    } else {
        // Add a new product
        products.push({ codigo, descricao, valorPrazo, valorVista, quantidade });
    }
    
    // Save the product list to localStorage
    saveToLocalStorage('products', products);

    alert('Produto salvo com sucesso!');
    document.getElementById('productForm').reset(); // Clear the form
    updateProductList();  // Update the product list
}

// Function to update the product list in the interface
function updateProductList() {
    const search = document.getElementById('searchProduct').value.toLowerCase();
    const productList = document.getElementById('productList');
    productList.innerHTML = '';  // Clear the list before filling

    products
        .filter(product => product.descricao.toLowerCase().includes(search))
        .forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.descricao} - Código: ${product.codigo} - Valor a Prazo: R$ ${parseFloat(product.valorPrazo).toFixed(2)} - Valor à Vista: R$ ${parseFloat(product.valorVista).toFixed(2)} - Quantidade: ${product.quantidade}`;
            
            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => deleteProduct(product.codigo);
            
            li.appendChild(deleteButton);
            productList.appendChild(li);
        });
}

// Function to delete a product
function deleteProduct(codigo) {
    if (confirm('Você tem certeza que deseja excluir este produto?')) {
        products = products.filter(product => product.codigo !== codigo);
        saveToLocalStorage('products', products);
        updateProductList();  // Update the list after deletion
    }
}

// Function to select product in the sale and show details (except quantity)
function selectProduct(product) {
    document.getElementById('produtoDisplay').value = product.descricao;
    document.getElementById('produto').value = product.codigo;
    fillProductDetails(product); // Fill product details except quantity
    closeProductModal();
}

// Function to fill product details in the sale (except quantity)
function fillProductDetails(product) {
    document.getElementById('detailCodigo').textContent = product.codigo;
    document.getElementById('detailDescricao').textContent = product.descricao;
    document.getElementById('detailValorPrazo').textContent = `R$ ${parseFloat(product.valorPrazo).toFixed(2)}`;
    document.getElementById('detailValorVista').textContent = `R$ ${parseFloat(product.valorVista).toFixed(2)}`;
    // Don't display quantity here; the user will define the quantity to be sold
}

// Function to open product modal in the sale
function openProductModal() {
    const modal = document.getElementById('productModal');
    const modalProductList = document.getElementById('modalProductList');
    modalProductList.innerHTML = ''; // Clear previous content

    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.descricao} - Código: ${product.codigo}`;
        li.onclick = () => selectProduct(product);
        modalProductList.appendChild(li);
    });

    modal.style.display = 'block';
}

// Function to close the product modal
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Function to finalize the sale
function finalizeSale() {
    const quantidade = document.getElementById('quantidade').value;
    
    if (!quantidade || quantidade <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }
    
    alert('Venda concluída com sucesso!');
    window.location.href = 'recebimento.html';
}

// Populate the list of products and clients on the sale screen
function populateSelects() {
    const clientSelect = document.getElementById('cliente');
    const productSelect = document.getElementById('produto');

    clientSelect.innerHTML = '';
    productSelect.innerHTML = '';

    // Populate clients in the select (example)
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.nome;
        option.textContent = client.nome;
        clientSelect.appendChild(option);
    });

    // Populate products in the select
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.codigo;
        option.textContent = `${product.descricao} - Código: ${product.codigo}`;
        productSelect.appendChild(option);
    });
}

// Event that updates the product list when the page loads
window.addEventListener('load', () => {
    updateProductList();
    populateSelects();
});

// Function to load selected product details
function loadProductDetails() {
    const produtoCodigo = document.getElementById('produto').value; // Code of the selected product

    if (!produtoCodigo) {
        alert('Por favor, selecione um produto primeiro.');
        return;
    }

    // Find the product in the product list by code
    const produtoSelecionado = products.find(product => product.codigo === produtoCodigo);

    if (produtoSelecionado) {
        // Fill product details in the sale
        fillProductDetails(produtoSelecionado);
    } else {
        alert('Produto não encontrado.');
    }
}


