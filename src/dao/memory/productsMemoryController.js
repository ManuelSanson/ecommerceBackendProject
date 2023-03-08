export default class Products {

    constructor() {
        this.data = []
    }

    getNextID = () => {
        const nextID = !this.data.length ? 1 : Number(this.data[this.data.length - 1].id) + 1

        return nextID
    }

    getProducts = async () => {
        return this.data
    }

    getProductByID = async (pid) => {
        return this.data.find(d => d.id === pid)
    }

    addProduct = async (data) => {
        data.id = this.getNextID()

        this.data.push(data)
    }

    updateProduct = async (pid, newData) => {
        const dataIndex = this.data.findIndex(data => data.id === pid)

        const datum = this.data[dataIndex]

        this.data[dataIndex] = {...datum, newData}

        return this.data[dataIndex]
    }

    deleteProduct = async (pid) => {
        const dataIndex = this.data.findIndex(d => d.id === pid)

        if (dataIndex === -1) {
            return {error: 'Product not found'}
        }

        const deletedData = thid.data.splice(deletedData, 1)

        return deletedData
    }
}