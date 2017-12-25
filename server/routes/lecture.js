import express from 'express';
import mongoose from 'mongoose';

import Lecture from '../models/Lecture';

import throwerror from './throwerror';

const router = express.Router();

router.post('/', (req, res) => { createLecture(req, res); });
router.get('/', (req, res) => { readLecture(req, res) });
const createLecture = (req, res) => {
    let lecture_obj = req.body.contents;

    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    let lecture = new Lecture({
        name: lecture_obj.name,
        link: lecture_obj.link,
        teacher: req.session.loginInfo._id,
        class: lecture_obj.class,
        accomplishments: [],
        date: new Date()
    });

    lecture.save( err => {
        if( err ) return throwerror(res, 409, 'DB error.');
        return res.json({ success: true, lecture: lecture });
    });
}

const readLecture = (req, res) =>{
    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    Lecture.find({teacher: req.session.loginInfo._id})
    .exec((err, lectures) => {
        if(err) return throwerror(res, 409, 'DB error.');
        res.json({success: true, lectures: lectures});
    });
}

let validateId = (id) =>{
	return mongoose.Types.ObjectId.isValid(id) ? true : false;
}



export default router;