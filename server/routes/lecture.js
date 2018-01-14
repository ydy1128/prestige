import express from 'express';
import mongoose from 'mongoose';

import Lecture from '../models/Lecture';

import throwerror from './throwerror';

const router = express.Router();

router.post('/', (req, res) => { createLecture(req, res); });
router.get('/', (req, res) => { readLecture(req, res) });
router.put('/:id', (req, res) => { updateLecture(req.params.id, req, res) });
router.delete('/:id', (req, res) => { deleteLecture(req.params.id, req, res) });

const createLecture = (req, res) => {
    let lecture_obj = req.body.contents;

    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    let lecture = new Lecture({
        name: lecture_obj.name,
        link: lecture_obj.link,
        teacher: req.session.loginInfo._id,
        class: lecture_obj.class,
        accomplishments: lecture_obj.accomplishments,
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
    let condition = {};
    if(req.session.loginInfo.role == 'teacher'){
        condition = {teacher: req.session.loginInfo._id};
    }
    else{
        if(req.session.loginInfo.class == undefined)
            return throwerror(res, 403, 'Student is not assigned to class.');
        else
            condition = {class: req.session.loginInfo.class};
    }
    Lecture.find(condition)
    .exec((err, lectures) => {
        if(err) return throwerror(res, 409, 'DB error.');
        res.json({success: true, lectures: lectures});
    });
}

const updateLecture = (id, req, res) =>{
    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    Lecture.findById(id, (err, lecture) => {
        if(err) return throwerror(res, 409, 'DB error.');
        // IF Class does not exist
        if(lecture == undefined) return throwerror(res, 409);
        // If exists, check teacher
        // if(lecture.teacher != req.session.loginInfo._id)
        //     return throwerror(res, 401, 'Unauthorized user.');

        // Modify class contents
        lecture.name = req.body.contents.name;
        lecture.link = req.body.contents.link;
        lecture.class = req.body.contents.class;
        lecture.accomplishments = req.body.contents.accomplishments;

        lecture.save((err, lecture) => {
            if(err) return throwerror(res, 409, 'DB error.');
            return res.json({
                success: true,
                lecture
            });
        });

    });

}

const deleteLecture = (id, req, res) =>{
    // Check class Validity
    if(!validateId(id))
        return throwError(res, 400, "Data format not valid.");
    // Check login status
    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');
    // Find memo by id
    Lecture.findById(id, (err, lecture) => {
        if(err) return throwerror(res, 409, 'DB error.');
        if(!lecture) return throwerror(res, 409);
        //check if teacher is valid
        if(lecture.teacher != req.session.loginInfo._id)
            return throwerror(res, 401, 'Unauthorized user.');
        // Remove class
        Lecture.remove({ _id: id }, err => {
            if(err) return throwerror(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
}

let validateId = (id) =>{
	return mongoose.Types.ObjectId.isValid(id) ? true : false;
}



export default router;