const socket = io()

const productsTableBody = document.getElementById('productsTableBody')
const createProductForm = document.getElementById('createProductForm')
const deleteProductForm = document.getElementById('deleteProductForm')

socket.on('products', (products) => {
    const allProducts = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td><img height="72px" width="72px" src=${product.thumbnail}/></td>
        </tr>
    `).join(' ')
    
    productsTableBody.innerHTML = allProducts
})

createProductForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(createProductForm)
    
    const product = {}
    
    for (const field of formData.entries()) {
        product[field[0]] = field[1]
    }

    socket.emit('addProduct', product)
})

deleteProductForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(deleteProductForm)
    
    let id = ''
    
    for (const field of formData.entries()) {
        id = field[1];
    }

    socket.emit('deleteProduct', Number(id))
})