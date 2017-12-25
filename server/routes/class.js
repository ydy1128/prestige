import express from 'express';
import Class from '../models/Class';
import mongoose from 'mongoose';

import throwerror from './throwerror';

const router = express.Router();

// Create class
router.post('/', (req, res) => {
	//Check login status
    if(typeof req.session.loginInfo === 'undefined')
         return throwerror(res, 401, 'User not logged in.');

    // Check if content is valid
    if(req.body.contents.name === "" || req.body.contents.startTime === "" ||
        req.body.contents.endTime === "" || req.body.contents.days === "" ||
        req.body.contents.name == undefined || req.body.contents.startTime == undefined ||
        req.body.contents.endTime == undefined || req.body.contents.days == undefined
    )
        return throwerror(res, 400, 'Empty contents.');

    let cls = new Class({
    	name: req.body.contents.name,
    	teacher: req.session.loginInfo._id,
    	students: [],
        startTime: req.body.contents.startTime,
        endTime: req.body.contents.endTime,
    	days: req.body.contents.days
    })
    cls.save( err => {
        if(err) return throwerror(res, 409, 'DB error.');
        return res.json({ success: true, data: cls });
    });
});

// Modify class
router.put('/:id', (req, res) => {

   // Check login status
    if(typeof req.session.loginInfo === 'undefined')
        return throwerror(res, 401, 'User not logged in.');

    // Check if content is valid
    if(req.body.contents.name === "" || req.body.contents.startTime === "" ||
        req.body.contents.endTime === "" || req.body.contents.days === "" ||
        req.body.contents.name == undefined || req.body.contents.startTime == undefined ||
        req.body.contents.endTime == undefined || req.body.contents.days == undefined
    )
        return throwerror(res, 400, 'Empty contents.');

    // Find Class
    Class.findById(req.params.id, (err, cls) => {
        if(err) return throwerror(res, 409, 'DB error.');
        // IF Class does not exist
        if(cls == undefined) return throwerror(res, 409);

        // If exists, check teacher
        if(cls.teacher != req.session.loginInfo._id)
            return throwerror(res, 401, 'Unauthorized user.');

        // Modify class contents
        cls.name = req.body.contents.name;
        cls.days = req.body.contents.days;
        cls.startTime = req.body.contents.startTime;
        cls.endTime = req.body.contents.endTime;
        cls.students = req.body.contents.students;

        cls.save((err, cls) => {
            if(err) return throwerror(res, 409, 'DB error.');
            return res.json({
                success: true,
                cls
            });
        });

    });
});

// Delete class
router.delete('/:id', (req, res) => {
    // Check class Validity
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return throwError(res, 400, "Data format not valid.");

    // Check login status
    if(typeof req.session.loginInfo === 'undefined')
        return throwerror(res, 401, 'User not logged in.');
    // Find memo by id
    Class.findById(req.params.id, (err, cls) => {
        if(err) return throwerror(res, 409, 'DB error.');
        if(!cls) return throwerror(res, 409);
        //check if teacher is valid
        if(cls.teacher != req.session.loginInfo._id)
            return throwerror(res, 401, 'Unauthorized user.');

        // Remove class
        Class.remove({ _id: req.params.id }, err => {
            if(err) return throwerror(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
});

// Get class list
router.get('/', (req, res) => {
    Class.find()
    .exec((err, classes) => {
        if(err) return throwerror(res, 409, 'DB error.');
        res.json(classes);
    });
});

export default router;
