import express from 'express';
import Comment from '../models/Comment';
import Homework from '../models/Homework';
import mongoose from 'mongoose';
import throwError from './throwerror';
import { log } from 'util';

const router = express.Router();

router.get('/homework/:homeworkId', (req, res) => { getCommentByHomeworkId(req, res); });
router.post('/homework/:homeworkId', (req, res) => { createComment(req, res); });
router.put('/', (req, res) => { updateComment(req, res); });
router.delete('/:commentId', (req, res) => { deleteComment(req, res); });

const getCommentByHomeworkId = (req, res) => {
    console.log('params : ' + JSON.stringify(req.params));
    console.log('body : ' + JSON.stringify(req.body));
    let homeworkId = req.params.homeworkId;
    if (!homeworkId) { return throwError(res, 404, 'homework id is required.'); }

    Comment.find({ homeworkId }).exec((err, comments) => {
        if(err) return throwError(res, 409, 'DB error.');
        res.json({success: true, comments});
    });
}

const createComment = (req, res) => {
    console.log('params : ' + JSON.stringify(req.params));
    console.log('body : ' + JSON.stringify(req.body));
    if (!req.session.loginInfo) { return throwError(res, 401, 'User not logged in.'); }
    if (!req.params.homeworkId) { return throwError(res, 404, 'homework id is required.'); }
    if (!req.body.comment) { return throwError(res, 404, 'comment is required.'); }

    let date = (new Date()).getTime() + "";
    Object.assign(req.body.comment, {
        writtenDate: date,
        editedDate: date,
        writer: req.session.loginInfo,
        homeworkId: req.params.homeworkId
    });

    let comment = new Comment(req.body.comment);    
    comment.save( err => {
        if (err) return throwError(res, 409, 'DB error.');
        res.json({ success: true, comment });
    });
}

const updateComment = (req, res) => {
    console.log('comment.updateComment');
    console.log('params : ' + JSON.stringify(req.params));
    console.log('body : ' + JSON.stringify(req.body));
    if (!req.session.loginInfo) { return throwError(res, 401, 'User not logged in.'); }
    if (!req.body.comment) { return throwError(res, 404, 'comment is required.'); }
    
    Comment.findById( req.body.comment._id, (err, comment) => {
        let userId = req.session.loginInfo.user._id;
        console.log('comment : ' + JSON.stringify(comment));
        if (err) return throwError(res, 409, 'DB error.');
        if (comment == null) return throwError(res, 404);
        if (comment.writer.user._id != userId) return throwError(res, 401, 'Unauthorized user');

        Object.assign(comment, req.body.comment);

        comment.save((err) => {
            if (err) return throwError(res, 409, 'DB error.');
            res.json({ success: true, comment });
        });
    });
}

const deleteComment = (req, res) => {
    console.log('params : ' + JSON.stringify(req.params));
    let valid = mongoose.Types.ObjectId.isValid(req.params.commentId);
    if (!valid) { return throwError(res, 400, "Data format not valid."); }

    Comment.findOne({ _id: req.params.commentId }, (err, comment) => {
        let userId = req.session.loginInfo.user._id;
        if (err) return throwerror(res, 409, 'DB error.');
        if (!comment) return throwError(res, 404);
        if (comment.writer.user._id != userId) return throwError(res, 401, 'Unauthorized user');

        comment.remove((err) => {
            if (err) return throwError(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
}

export default router;
