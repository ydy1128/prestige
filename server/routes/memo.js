import express from 'express';
import mongoose from 'mongoose';

import MemoList from '../models/memo/MemoList';
import MemoGroup from '../models/memo/MemoGroup';

import throwerror from './throwerror';


const router = express.Router();

router.post('/list', (req, res) => { createMemoList(req, res) });
router.get('/list', (req, res) => { readMemoList(req, res) });
router.put('/list/:id', (req, res) => { updateMemoList(req.params.id, req, res) });
router.delete('/list/:id', (req, res) => { deleteMemoList(req.params.id, req, res) });

router.post('/group', (req, res) => { createMemoGroup(req, res) });
router.get('/group/:id', (req, res) => { readMemoGroup(req.params.id, req, res) });
router.put('/group/:id', (req, res) => { updateMemoGroup(req.params.id, req, res) });
router.delete('/group/:id', (req, res) => { deleteMemoGroup(req.params.id, req, res) });
router.delete('/groups-by-list-id/:id', (req, res) => { deleteMemoGroupsById(req.params.id, req, res) });


const createMemoList = (req, res) =>{
	let memoListObj = req.body.contents;

    if(memoListObj.name == '' || memoListObj.name == undefined)
        return throwerror(res, 400, 'Bad contents.')

    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    let memolist = new MemoList({
        name: memoListObj.name,
        teacher: req.session.loginInfo.user._id,
    });

    memolist.save( err => {
        if( err ) return throwerror(res, 409, 'DB error.');
        return res.json({ success: true, memolist });
    });
}

const readMemoList = (req, res) =>{
    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    if(req.session.loginInfo.role != 'teacher')
    	return throwerror(res, 401, 'User not a teacher.');

    MemoList.find({}, (err, memolist) => {
        if(err) return throwerror(res, 409, 'DB error.');
        res.json({success: true, memolist });
    });
}

const updateMemoList = (id, req, res) =>{
    if(!validateId(id))
        return throwerror(res, 400, "Data format not valid.");
    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    MemoList.findById(id, (err, memolist) => {
        if(err) return throwerror(res, 409, 'DB error.');

        if(memolist == undefined) return throwerror(res, 409);

        memolist.name = req.body.contents.name;

        memolist.save((err, memolist) => {
            if(err) return throwerror(res, 409, 'DB error.');
            return res.json({
                success: true,
                memolist
            });
        });

    });

}

const deleteMemoList = (id, req, res) =>{
    if(!validateId(id))
        return throwerror(res, 400, "Data format not valid.");

    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    MemoList.findById(id, (err, memolist) => {
        if(err) return throwerror(res, 409, 'DB error.');
        if(!memolist) return throwerror(res, 409);

        // Remove class
        MemoList.remove({ _id: id }, err => {
            if(err) return throwerror(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
}

// let validateId = (id) =>{
// 	return mongoose.Types.ObjectId.isValid(id) ? true : false;
// }

const createMemoGroup = (req, res) =>{
    let memoGroupObj = req.body.contents;
    if(memoGroupObj.name == '' || memoGroupObj.name == undefined)
        return throwerror(res, 400, 'Bad contents.')
    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    let memogroup = new MemoGroup({
        name: memoGroupObj.name,
        teacher: req.session.loginInfo.user._id,
        memoList: memoGroupObj.memoList,
        memos: []
    });

    memogroup.save( err => {
        if( err ) return throwerror(res, 409, 'DB error.');
        return res.json({ success: true, memogroup });
    });
}

const readMemoGroup = (id, req, res) =>{
    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    if(req.session.loginInfo.role != 'teacher')
        return throwerror(res, 401, 'User not a teacher.');

    MemoGroup.find({ memoList: id}, (err, memogroups) => {
        if(err) return throwerror(res, 409, 'DB error.');
        console.log(memogroups)
        res.json({success: true, memogroups });
    });
}

const updateMemoGroup = (id, req, res) =>{
    if(!validateId(id))
        return throwerror(res, 400, "Data format not valid.");
    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    MemoGroup.findById(id, (err, memogroup) => {
        if(err) return throwerror(res, 409, 'DB error.');

        if(memogroup == undefined) return throwerror(res, 409);
        console.log(memogroup);
        memogroup.name = req.body.contents.name;
        memogroup.memos = req.body.contents.memos;

        memogroup.save((err, memogroup) => {
            if(err) return throwerror(res, 409, 'DB error.');
            return res.json({
                success: true,
                memogroup
            });
        });

    });
}

const deleteMemoGroup = (id, req, res) => {
    if(!validateId(id))
        return throwerror(res, 400, "Data format not valid.");
    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    MemoGroup.findById(id, (err, memogroup) => {
        if(err) return throwerror(res, 409, 'DB error.');
        if(!memogroup) return throwerror(res, 409);

        // Remove class
        MemoGroup.remove({ _id: id }, err => {
            if(err) return throwerror(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
}

const deleteMemoGroupsById = (id, req, res) => {
    if(!validateId(id))
        return throwerror(res, 400, "Data format not valid.");
    if(req.session.loginInfo == undefined)
        return throwerror(res, 401, 'User not logged in.');

    // Remove classes
    MemoGroup.remove({ memoList: id }, err => {
        if(err) return throwerror(res, 409, 'DB error.');
        res.json({ success: true });
    });
}


let validateId = (id) =>{
    return mongoose.Types.ObjectId.isValid(id) ? true : false;
}

export default router;