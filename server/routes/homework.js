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
    let hwInfo = req.body.contents;
    if(not(req.session.loginInfo)) { return throwError(res, 401, 'User not logged in.');}
    if(not(validateData(hwInfo, "all"))) { return throwError(res, 400, "Data format not valid.");}

    Object.assign(  hwInfo, {
        accomplishments: [],
        modifiedDate: "",
        teacherId: req.session.loginInfo.user._id,
    });

    let hw = new Homework(hwInfo);

    hw.save( err => {
        if(err) return throwError(res, 409, 'DB error.');
        return res.json({ success: true, homework: hw });
    });
}

const readHomework = (req, res) => {
    let hwId = req.params.id;
    Homework.find(hwId ? { _id: hwId } : null).sort({$natural:-1}).exec((err, hws) => {
        if(err) return throwError(res, 409, 'DB error.');
        res.json(hws);
    })
}

const updateHomework = (req, res) => {
    let modifiedHwInfo = req.body.contents;
    let hwId = req.params.id;
    let userId = modifiedHwInfo.teacherId;

    // Find Class
    Homework.findById( hwId, (err, hw) => {
        if(err) return throwError(res, 409, 'DB error.');
        if(not(hw)) return throwError(res, 409);
        if(hw.teacherId != userId) return throwError(res, 401, 'Unauthorized user');

        Object.assign(hw, modifiedHwInfo)
        hw.save((err, hw) => {
            if(err) return throwError(res, 409, 'DB error.');
            return res.json({ success: true, homework: hw });
        });
    });
}

const deleteHomework = (req, res) => {
    let hwId = req.params.id;
    let valid = mongoose.Types.ObjectId.isValid(hwId);
    let loginInfo = req.session.loginInfo;

    if(not(valid)) { return throwError(res, 400, "Data format not valid."); }
    if(not(loginInfo)) { throwError(res, 401, 'User not logged in.'); }

    Homework.findById(hwId, (err, hw) => {
        let userId = req.session.loginInfo.user._id;
        if(err) return throwerror(res, 409, 'DB error.');
        if(not(hw)) return throwError(res, 409);
        if(hw.teacherId != userId) return throwError(res, 401, 'Unauthorized user');

        // Remove class
        Homework.remove({ _id: hwId }, err => {
            if(err) return throwError(res, 409, 'DB error.');
            let filePath = path.join(__dirname, "../../", uploadBasePath , hwId);
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
