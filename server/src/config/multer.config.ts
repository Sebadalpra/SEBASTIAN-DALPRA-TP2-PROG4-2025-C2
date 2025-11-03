import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      const nombreArchivo = `${Date.now()}-${file.originalname}`;
      cb(null, nombreArchivo);
    },
  }),
};
