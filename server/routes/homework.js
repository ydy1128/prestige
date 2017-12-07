import express from 'express';
import Homework from '../models/Homework';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', (req, res) => { createHomework(req, res); });
router.get('/', (req, res) => { readHomework(req, res); });
router.put('/:id', (req, res) => { updateHomework(req, res); });
router.delete('/:id', (req, res) => { deleteHomewerk(req, res); });

const createHomework = (req, res) => {
    let hwInfo = req.body.contents;

    if(not(req.session.loginInfo)) {
        return throwError(res, 1);
    }

    if(not(validateData(contents, "all"))) {
        return throwError(res, 2);
    }

    let newhwInfo = Object.assign({}, hwInfo, {
        accomplishments: [],
        modifiedDate: "",
        teacherId: req.session.loginInfo._id,
    });

    let hw = new Homework(newhwInfo);

    hw.save( err => {
        if( err ) throw err;
        return res.json({ success: true, data: hw });
    });
}

const readHomework = (req, res) => {
    Homework.find().exec((err, hws) => {
        if(err) throw err;
        res.json(hws);
    })
}

const updateHomework = (req, res) => {
    let modifiedHwInfo = req.body.contents;
    let hwId = req.params.id;
    let userId = req.session.loginInfo._id;

    // Find Class
    Homework.findById( hwId, (err, hw) => {
        if(err) throw err;
        if(not(hw)) return throwError(res, 3)
        if(hw.teacherId != userId) return throwError(res, 4);

        hw = Object.assign({}, hw, modifiedHwInfo);

        hw.save((err, hw) => {
            if(err) throw err;
            return res.json({ success: true, data: hw });
        });
    });
}

const deleteHomewerk = (req, res) => {
    let hwId = res.params.id;
    let valid = mongoose.Types.ObjectId.isValid(hwId);
    let loginInfo = req.session.loginInfo;

    if(not(valid)) { return throwError(res, 1);}
    if(not(loginInfo)) { return throwError(res, 2); }

    Homework.findById(hwId, (err, hw) => {
        let userId = req.session.loginInfo._id;
        if(err) throw err;
        if(not(hw)) return throwError(res, 3); ;
        if(hw.teacherId != userId) return throwError(res, 4);

        // Remove class
        Homework.remove({ _id: hwId }, err => {
            if(err) throw err;
            res.json({ success: true });
        });
    });
}

// Utils
var not = (factor) => !factor;

var validateData = (data, checkList) => {
    if (typeof checkList == "string" && checkList == "all") {
        checkItem = Object.keys(data);
    }

    for(let checkItem of checkList) {
        if(not(checkList[checkItem])) return false
    }

    return true
}

var throwError = (res, code) => {
    let errorState = {};
    let errorCode = 0;
    switch (code) {
        case 1:
            erroCode = 400
            erroState = { code, error: "INVALID ID" };
            break;
        case 2:
            erroCode = 403
            erroState = { code, error: "NOT LOGGED IN" };
            break;
        case 3:
            erroCode = 404
            erroState = { code, error: "NO RESOURCE" };
            break;
        case 4:
            erroCode = 403
            erroState = { code, error: "PERMISSION FAILURE" };
            break;
        default:

    }
    return res.status(errorCode).json(erroState)
}

export default router;
