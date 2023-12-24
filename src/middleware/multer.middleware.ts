import multer from 'multer'
import path from 'path'

export const upload = multer({
  // handle multipart data
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb): void => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(null, false)
    } else {
      cb(null, true)
    }
  },
})
