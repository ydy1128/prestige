import express from 'express';
import Comment from '../models/Comment';
import Homework from '../models/Homework';
import mongoose from 'mongoose';
import throwError from './throwerror';
import { log } from 'util';

const router = express.Router();

router.post('/', (req, res) => { createComment(req, res); });
router.get('/', (req, res) => { readComment(req, res); });
router.put('/:id', (req, res) => { updateComment(req, res); });
router.delete('/:id', (req, res) => { deleteComment(req, res); });

const createComment = (req, res) => {
    let commentJson = req.body.contents;
    if(not(req.session.loginInfo)) { return throwError(res, 401, 'User not logged in.');}
    // if(not(validateData(commentJson, "all"))) { return throwError(res, 400, "Data format not valid.");}
    let date = (new Date()).getTime() + "";
        
    Object.assign( commentJson, {
        writtenDate: date,
        editedDate: date,
        writer: req.session.loginInfo
    });

    let comment = new Comment(commentJson);

    Homework.findById(commentJson.homeworkId, (err, hw) => {
        if(err) return throwError(res, 409, 'DB error.');
        if(not(hw)) return throwError(res, 409);
        if(hw.teacherId != req.session.loginInfo.user._id) return throwError(res, 401, 'Unauthorized user');
        Object.assign(hw, {comments: [...hw.comments, comment._id]})
        console.log('hw', hw)

        hw.save((err, hw) => {
            if(err) return throwError(res, 409, 'DB error.');
        });
    })
    
    comment.save( err => {
        if(err) return throwError(res, 409, 'DB error.');
        return res.json({ success: true, comment });
    });
}

// comment id list를 받아 조회하고 조회된 복수개의 comment data를 리턴한다.
const readComment = (req, res) => { 
    console.log(req.query)
    let commentIds = req.query.comments ? JSON.parse(req.query.comments) : [];
    console.log('commentIds', commentIds)
    let querys = null;
    if(commentIds.length) {
        querys = commentIds.map((id) =>
        mongoose.Types.ObjectId(id));
    }

    Comment.find(querys ? { _id: querys } : {_id: null }).exec((err, comments) => {
        if(err) return throwError(res, 409, 'DB error.');
        res.json({success: true, comments});
    })
}

const updateComment = (req, res) => {
    let commentInfo = req.body.contents;
    let commentId = commentInfo._id;
    let userId = req.session.loginInfo.user._id;
    delete commentInfo._id

    // Find Class
    Comment.findById( commentId, (err, comment) => {
        if(err) return throwError(res, 409, 'DB error.');
        if(not(comment)) return throwError(res, 409);
        if(comment.writer.user._id != userId) return throwError(res, 401, 'Unauthorized user');

        Object.assign(comment, commentInfo)

        comment.save((err, comment) => {
            if(err) return throwError(res, 409, 'DB error.');
            return res.json({ success: true, comment });
        });
    });
}

const deleteComment = (req, res) => {
    let commentId = req.params.id;
    let valid = mongoose.Types.ObjectId.isValid(commentId);
    let loginInfo = req.session.loginInfo;

    if(not(valid)) { return throwError(res, 400, "Data format not valid."); }
    if(not(loginInfo)) { throwError(res, 401, 'User not logged in.'); }

    Comment.findById(commentId, (err, comment) => {
        let userId = loginInfo.user._id;
        if(err) return throwerror(res, 409, 'DB error.');
        if(not(comment)) return throwError(res, 409);
        if(comment.writer.user._id != userId) return throwError(res, 401, 'Unauthorized user');
        
        Homework.findById(comment.homeworkId, (err, hw) => {
            if(err) return throwError(res, 409, 'DB error.');
            if(not(hw)) return throwError(res, 409);
            if(hw.teacherId != req.session.loginInfo.user._id) return throwError(res, 401, 'Unauthorized user');
            let comments = hw.comments.filter((cmtId) => { 
                return cmtId != commentId
            })
            Object.assign(hw, {comments: comments.length ? comments : []})
            hw.save((err, hw) => {
                if(err) return throwError(res, 409, 'DB error.');
                // Remove class
                Comment.remove({ _id: commentId }, err => {
                    if(err) return throwError(res, 409, 'DB error.');
                    res.json({ success: true });
                });
            });
        })
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
