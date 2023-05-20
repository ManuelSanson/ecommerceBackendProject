import multer from 'multer';

const documents = ['ID', 'ComprobanteDomicilio', 'EstadoCuenta']

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = '';
        if (file.fieldname === 'profileImage') {
            folder = 'profiles';
        } else if (file.fieldname === 'productImage') {
            folder = 'products';
        } else if (documents.includes(file.fieldname)) {
            folder = 'documents';
        } else {
            throw new Error('El fieldname no es correcto')
        }
        cb(null, folder);
        },
        filename: function (req, file, cb) {
        cb(null, file.originalname)
        }
    });

const upload = multer({ storage: storage })
export const cpUpload = upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'productImage' }, { name: 'ID'}, { name: 'ComprobanteDomicilio'}, { name: 'EstadoCuenta'}])