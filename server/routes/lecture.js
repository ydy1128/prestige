import express from 'express';
import mongoose from 'mongoose';

import Lecture from '../models/Lecture';

import throwError from './throwerror';

const router = express.Router();

router.post('/', (req, res) => { createLecture(req, res); });

const createLecture = (req, res) => {
    let lecture_obj = req.body.contents;
    if(!validateId(req.params.id))
    	return throwError(res, 400, "Data format not valid.");

    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    let lecture = new Lecture(Object.assign({}, lecture_obj, {
        teacher: req.session.loginInfo._id,
    }));

    lecture.save( err => {
        if( err ) return throwerror(res, 409, 'DB error.');
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