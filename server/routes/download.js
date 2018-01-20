import express from 'express';
import fs from 'fs';
import path from 'path';
import throwError from './throwerror'

const router = express.Router();

// baseUrl/api/download?hwId=[id]
router.get('*', (req, res) => {getList(req,res)}); // 해당 hw id를 쿼리로 받아 해당 directory에 속한 file들의 경로를 array 로 제공

var getList =  (req, res) => {
    let hwId = req.query.hwId;
    let dir = path.join(__dirname ,'../..', '/public/uploads/' , hwId);
    
    let filePaths = fs.readdirSync(dir).map( fileName => '/public/uploads/'+ hwId + '/' + fileName ) ;
    res.json({filePaths})
    // 해당 hw id의 디렉토리 있는지 확인
    // 있으면 해당 디렉토리 내부 파일을 넘김
    // 없으면 directory 생성 후, empty array를 res로 전달
};

const getFile = (req, res) => {
    let hwId = req.query.hwId;
    let fileName = req.query.fileName;
    let downloadPath = 'uploads/' + hwId + '/' + fileName;
    res.download(downloadPath);
    console.log(req.files);
}

export default router;
