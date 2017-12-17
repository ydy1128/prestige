import express from 'express';
import mongoose from 'mongoose';

import Lecture from '../models/Lecture';

import throwError from './throwerror';

const router = express.Router();

router.post('/', (req, res) => { createLecture(req, res); });

const createLecture = (req, res) => {
    let lecture_obj = req.body.contents;
    if(!validateId(req.params.id)){
    	return throwError(res, 1);
    }
    if(req.session.loginInfo == undefined){
        return throwError(res, 2);
    }

    let lecture = new Lecture(Object.assign({}, lecture_obj, {
        teacher: req.session.loginInfo._id,
    }));

    lecture.save( err => {
        if( err ) throw err;
        return res.json({ success: true, homework: lecture });
    });
}

// const readLecture = (req, res) =>{
// 	let teacher_id = 
// }

let validateId = (id) =>{
	return mongoose.Types.ObjectId.isValid(req.params.id) ? true : false;
}



export default router;