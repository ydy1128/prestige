import express from 'express';
import Comment from '../models/Comment';
import Homework from '../models/Homework';
import mongoose from 'mongoose';
import throwError from './throwerror';
import { log } from 'util';


const router = express.Router();

router.post('/', (req, res) => { createComment(req, res); });
router.get('*', (req, res) => { readComment(req, res); });
router.put('/:id', (req, res) => { updateComment(req, res); });
router.delete('/:id', (req, res) => { deleteComment(req, res); });

const createComment = (req, res) => {
    let commentJson = req.body.contents;
    if(not(req.session.loginInfo)) { return throwError(res, 401, 'User not logged in.');}
    // if(not(validateData(commentJson, "all"))) { return throwError(res, 400, "Data format not valid.");}
    

    Object.assign( commentJson, {
        writer: req.session.loginInfo.user
    });

    let comment = new Comment(commentJson);
    console.log('check user info', req.session.loginInfo)
    console.log('check comment id', comment);

    Homework.findById(commentJson.homeworkId, (err, hw) => {
        if(err) return throwError(res, 409, 'DB error.');
        if(not(hw)) return throwError(res, 409);
        if(hw.teacherId != userId) return throwError(res, 401, 'Unauthorized user');
        Object.assign(hw, {comments: [...hw.comments, comment._id]})

    })

    comment.save( err => {
        if(err) return throwError(res, 409, 'DB error.');
        return res.json({ success: true, comment });
    });
}

const readComment = (req, res) => {
    let hwId = req.params.id;
    Comment.find(hwId ? { _id: hwId } : null).exec((err, hws) => {
        if(err) return throwError(res, 409, 'DB error.');
        res.json(hws);
    })
}

const updateComment = (req, res) => {
    let modifiedHwInfo = req.body.contents;
    let hwId = req.params.id;
    let userId = req.session.loginInfo.user._id;
    delete modifiedHwInfo._id

    // Find Class
    Comment.findById( hwId, (err, hw) => {
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

const deleteComment = (req, res) => {
    let hwId = req.params.id;
    let valid = mongoose.Types.ObjectId.isValid(hwId);
    let loginInfo = req.session.loginInfo;

    if(not(valid)) { return throwError(res, 400, "Data format not valid."); }
    if(not(loginInfo)) { throwError(res, 401, 'User not logged in.'); }

    Comment.findById(hwId, (err, hw) => {
        let userId = req.session.loginInfo.user._id;
        if(err) return throwerror(res, 409, 'DB error.');
        if(not(hw)) return throwError(res, 409);
        if(hw.teacherId != userId) return throwError(res, 401, 'Unauthorized user');

        // Remove class
        Comment.remove({ _id: hwId }, err => {
            if(err) return throwError(res, 409, 'DB error.');
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
