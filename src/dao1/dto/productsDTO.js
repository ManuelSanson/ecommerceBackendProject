export default class ProductDTO {
    
    constructor(product) {
        this.id = product.id || product._id || null
        this.title = product.title || ""
        this.description = product.description || ""
        this.code = product.code || ""
        this.price = product.price || 0
        this.status = product.status || true
        this.stock = product.stock || 0
        this.category = product.category || ""
        this.thumbnails = product.thumbnails || ""
        this.owner = product.owner || "admin"
    }
}