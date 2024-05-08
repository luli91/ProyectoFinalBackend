import multer from 'multer';
import fs from 'fs';

const dir = './uploads';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const upload = multer({ dest: dir });

export default upload;
