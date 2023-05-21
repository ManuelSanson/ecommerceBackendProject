export default class UserDTO {
    
    constructor(user) {
        this.id = user.id || user._id || null
        this.firstName = user.firstName || ""
        this.lastName = user.lastName || ""
        this.email = user.email || ""
        this.password = user.password || ""
        this.age = user.age || ""
        this.role = user.role || "user"
        this.documents = user.documents || []
        this.lastConnection = user.lastConnection || null
    }
}