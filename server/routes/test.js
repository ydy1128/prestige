import express from 'express';
import fs from 'fs';
import path from 'path';
import throwError from './throwerror'

const router = express.Router();

// baseUrl/api/test
router.get('*', (req, res) => {testFunc(req,res)}); 

var testFunc =  (req, res) => {
    let params = req.params;
    let fileName = path.join(__dirname,'../../public/uploads/손준혁.docx');
    let file = fs.readFileSync(fileName)
    res.sendFile(file)
};

export default router;
