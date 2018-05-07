import express from 'express';
import Homework from '../models/Homework';
import mongoose from 'mongoose';
import throwError from './throwerror';
import { log } from 'util';
import path from 'path';
import rimraf from 'rimraf';

const router = express.Router();
const uploadBasePath = 'public/uploads/';

router.post('/', (req, res) => { createHomework(req, res); });
router.get('*', (req, res) => { readHomework(req, res); });
router.put('/:id', (req, res) => { updateHomework(req, res); });
router.delete('/:id', (req, res) => { deleteHomework(req, res); });

const createHomework = (req, res) => {
    let homeworkInfo = req.body.contents;
    if(not(req.session.loginInfo)) { return throwError(res, 401, 'User not logged in.');}
    if(not(validateData(homeworkInfo, "all"))) { return throwError(res, 400, "Data format not valid.");}

    let homework = new Homework(Object.assign( req.body.contents, {
            accomplishments: [],
            modifiedDate: "",
            teacherId: req.session.loginInfo.user._id,
        }
    ));

    homework.save( err => {
        if(err) return throwError(res, 409, 'DB error.');
        return res.json({ success: true, homework: homework });
    });
}

const readHomework = (req, res) => {
    let homeworkId = req.params.id;
    Homework.find(homeworkId ? { _id: homeworkId } : null).sort({$natural:-1}).exec((err, homeworks) => {
        if(err) return throwError(res, 409, 'DB error.');
        res.json(homeworks);
    })
}

const updateHomework = (req, res) => {
    let modifiedHwContents = req.body.contents;
    let homeworkId = req.params.id;
    let userId = modifiedHwContents.teacherId;

    // Find Class
    Homework.findById( homeworkId, (err, homework) => {
        if(err) return throwError(res, 409, 'DB error.');
        if(not(homework)) return throwError(res, 409);
        if(homework.teacherId != userId) return throwError(res, 401, 'Unauthorized user');

        Object.assign(homework, modifiedHwContents)
        homework.save((err, homework) => {
            if(err) return throwError(res, 409, 'DB error.');
            return res.json({ success: true, homework: homework });
        });
    });
}

const deleteHomework = (req, res) => {
    let homeworkId = req.params.id;
    let valid = mongoose.Types.ObjectId.isValid(homeworkId);
    let loginInfo = req.session.loginInfo;

    if(not(valid)) { return throwError(res, 400, "Data format not valid."); }
    if(not(loginInfo)) { throwError(res, 401, 'User not logged in.'); }

    Homework.findById(homeworkId, (err, homework) => {
        let userId = req.session.loginInfo.user._id;
        if(err) return throwerror(res, 409, 'DB error.');
        if(not(homework)) return throwError(res, 409);
        if(homework.teacherId != userId) return throwError(res, 401, 'Unauthorized user');

        // Remove class
        Homework.remove({ _id: homeworkId }, err => {
            if(err) return throwError(res, 409, 'DB error.');
            let filePath = path.join(__dirname, "../../", uploadBasePath , homeworkId);
            rimraf(filePath, 
                (res)=>{ }, 
                (err)=>{ }
            );
            res.json({ success: true });
        });
    });
}

// Utils
var not = (factor) => !factor;

var validateData = (data, checkList) => {
    if (typeof checkList == "string" && checkList == "all") {
        checkList = Object.keys(data);
    }

    for(let checkItem of checkList) {
        if(not(checkList.includes(checkItem))) return false
    }

    return true
}

export default router;
