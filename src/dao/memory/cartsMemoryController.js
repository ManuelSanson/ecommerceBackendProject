export default class Carts {

    constructor() {
        this.data = []
    }

    getNextID = () => {
        const nextID = !this.data.length ? 1 : Number(this.data[this.data.length - 1].id) + 1

        return nextID
    }

    getCarts = async () => {
        return this.data
    }

    getCartByID = async (cid) => {
        return this.data.find(d => d.id === cid)
    }

    addCart = async (data) => {
        data.id = this.getNextID()

        this.data.push(data)
    }

    updateCart = async (id, newData) => {
        const dataIndex = this.data.findIndex(data => data.id === cid)

        const datum = this.data[dataIndex]

        this.data[dataIndex] = {...datum, newData}

        return this.data[dataIndex]
    }

    addProductToCart = async (cid, pid) => {
        const datum = await this.getCartByID(cid)

        let found = false
        for (let i = 0; i < datum.products.length; i++) {
            if (datum.products[i].id === pid) {
                datum.products[i].quantity++
                found = true
                break
            }            
        }

        if (!found) {
            datum.products.push({id: pid, quantity: 1})
        }

        await this.updateCart(cid, datum)

        return datum
    }
}