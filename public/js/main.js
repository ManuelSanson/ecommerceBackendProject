const productsTableBody = document.getElementById('productsTableBody')
const createProductForm = document.getElementById('createProductForm')
const deleteProductForm = document.getElementById('deleteProductForm')
const socket = io()

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
    if (productsTableBody) {
        productsTableBody.innerHTML = allProducts
    }
})

if (createProductForm) {
    
    createProductForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = new FormData(createProductForm)
        
        const product = {}
        
        for (const field of formData.entries()) {
            product[field[0]] = field[1]
        }
    
        socket.emit('addProduct', product)
    })
}

if (deleteProductForm) {
    deleteProductForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = new FormData(deleteProductForm)
        
        let id = ''
        
        for (const field of formData.entries()) {
            id = field[1];
        }
    
        socket.emit('deleteProduct', Number(id))
    })
}


let user
let chatBox = document.getElementById('chatBox')

if (chatBox) {
    Swal.fire({
        title: `Please enter your email`,
        input: 'text',
        inputValidator: value => {
            return !value && 'Email is required' 
        },
        allowOutsideClick: false
    }).then(result => {
        user = result.value
        let txtUsername = document.getElementById('username')
        txtUsername.innerHTML = user
        socket.emit('authenticated', user)
    })
}

if (chatBox) {
    chatBox.addEventListener('keyup', event => {
        if (event.key == 'Enter') {
            if (chatBox.value.trim().length > 0) {
                socket.emit('message', {
                    user,
                    message: chatBox.value
                })
                chatBox.value = ''
            }
        }
    })
}

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs')
    let messages = ''

    data.forEach(message => {
        messages += `<b> ${message.user} </b>: "${message.message}" <br>`
    })

    log.innerHTML = messages
})