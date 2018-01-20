import express from 'express';
import Homework from '../models/Homework';
import mongoose from 'mongoose';
import fs from 'fs';
import multer from 'multer';
import mkdirp from 'mkdirp';
import throwError from './throwerror'
import path from 'path';
import rimraf from 'rimraf';

const router = express.Router();
const uploadBasePath = 'public/uploads/';
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const path = uploadBasePath + req.query.hwId
    mkdirp(path, err => callback(err, path))
    callback(null, path);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname); //callback(null, file.fieldname + '-' + Date.now());
  }
});

const upload = multer({ storage : storage });

router.post('*', upload.array('file'), (req, res) => {
  let hwId = req.query.hwId;
  let userId = req.session.loginInfo._id;
  let fileNames = req.files.map((file) => file.filename);
  let filePath = path.join(__dirname, "../../", uploadBasePath , req.query.hwId);
  
  // remove previous files in hw's directory
  rimraf(filePath,() => { console.log('done'); }, (err) => { console.log('error'); });

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
});

const uploadDate = (req, res) => {
    console.log(req.files);
}

export default router;
