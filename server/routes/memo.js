import express from 'express';
import mongoose from 'mongoose';

import MemoGroup from '../models/MemoGroup';

import throwerror from './throwerror';


const router = express.Router();

router.post('/', (req, res) => { createMemoGroup(req, res) });
router.get('/', (req, res) => { readMemoGroup(req, res) });
router.put('/:id', (req, res) => { updateMemoGroup(req.params.id, req, res) });
router.delete('/:id', (req, res) => { deleteMemoGroup(id, req, res) });

const createMemoGroup = (req, res) =>{
	let memo_object = req.body.contents;

    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    let memogroup = new MemoGroup({
        name: memo_object.name,
        memo: [],
    });

    memogroup.save( err => {
        if( err ) return throwerror(res, 409, 'DB error.');
        return res.json({ success: true, memogroup });
    });
}

const readMemoGroup = (req, res) =>{
    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    if(req.session.loginInfo.role != 'teacher')
    	return throwerror(res, 401, 'User not a teacher.');

    MemoGroup.find({}, (err, memogroup) => {
        if(err) return throwerror(res, 409, 'DB error.');
        res.json({success: true, memogroup });
    });
}

const updateMemoGroup = (id, req, res) =>{
    if(!validateId(id))
        return throwError(res, 400, "Data format not valid.");
    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    MemoGroup.findById(id, (err, memogroup) => {
        if(err) return throwerror(res, 409, 'DB error.');

        if(memogroup == undefined) return throwerror(res, 409);

        memogroup.name = req.body.contents.name;
        memogroup.memo = req.body.contents.memo;

        memogroup.save((err, memogroup) => {
            if(err) return throwerror(res, 409, 'DB error.');
            return res.json({
                success: true,
                memogroup
            });
        });

    });

}

const deleteMemoGroup = (id, req, res) =>{
    if(!validateId(id))
        return throwError(res, 400, "Data format not valid.");

    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    MemoGroup.findById(id, (err, lecture) => {
        if(err) return throwerror(res, 409, 'DB error.');
        if(!lecture) return throwerror(res, 409);

        // Remove class
        MemoGroup.remove({ _id: id }, err => {
            if(err) return throwerror(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
}

let validateId = (id) =>{
	return mongoose.Types.ObjectId.isValid(id) ? true : false;
}

