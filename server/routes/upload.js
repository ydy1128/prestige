import express from 'express';
import fs from 'fs';
import multer from 'multer';
import throwError from './throwerror'

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname); //callback(null, file.fieldname + '-' + Date.now());
  }
});

const upload = multer({ storage : storage });

router.post('/', upload.array('file'), (req, res) => { uploadDate(req, res); });

const uploadDate = (req, res) => {
    console.log(req.files);
}

export default router;
