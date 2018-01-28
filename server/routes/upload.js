import express from 'express';
import Homework from '../models/Homework';
import mongoose from 'mongoose';
import fs from 'fs';
import multer from 'multer';
import mkdirp from 'mkdirp';
import throwError from './throwerror'
import path from 'path';
import rimraf from 'rimraf';
import { log } from 'util';

const router = express.Router();

const uploadBasePath = 'public/uploads/';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const path = uploadBasePath + req.query.hwId
    // remove previous files in hw's directory
    callback(null, path);
  },
  filename: (req, file, callback) => {
    console.log('file in filename', file)
    callback(null, file.originalname); //callback(null, file.fieldname + '-' + Date.now());
  }
});

const upload = multer({ storage : storage });

let removeMiddleware = router.post('*',
  (req, res, next) => {
    console.log('test1')
    let filePath = path.join(__dirname, "../../", uploadBasePath , req.query.hwId);
    rimraf(filePath, 
    (res)=>{
      mkdirp(filePath, err => {
        console.log('before next');
        next();
      });
    }, 
    (err)=>{
      mkdirp(filePath, err => {
        console.log('before next');
        next();
      });
    });
  }
)

let uploadMiddleware = router.post('*', upload.array('file'),(req,res) => {
    console.log('after next');
    let hwId = req.query.hwId;
    let userId = req.session.loginInfo.user._id;
    let fileNames = req.files.map((file) => {
      return file.filename;
    });
    
    Homework.findById(hwId, (err, hw) => {
      if(err) return throwerror(res, 409, 'DB error.');
      if(!hw) return throwError(res, 409);
      if(hw.teacherId != userId) return throwError(res, 401, 'Unauthorized user');
      Object.assign(hw, {files: fileNames})
  
      hw.save((err, hw) => {
        if(err) return throwerror(res, 409, 'DB error.');
        return res.json({ success: true, homework: hw });
      });
    })
  }
);

router.use('*', [removeMiddleware, uploadMiddleware]);

const uploadDate = (req, res) => {
    console.log(req.files);
}

export default router;
