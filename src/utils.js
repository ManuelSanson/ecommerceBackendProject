import {fileURLToPath } from 'url';
import {dirname} from 'path';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

faker.locale = 'es'

export const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description: faker.commerce.productDescription,
        price: faker.commerce.price(),
        status: true,
        stock: faker.random.numeric(1),
        category: faker.commerce.department,
        image: faker.image.image()
    }
}

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname