import express from 'express';
import Class from '../models/class';
import mongoose from 'mongoose';

const router = express.Router();

// Create class
router.post('/', (req, res) => {
	//Check login status
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    }

    // Check if content is valid
    if(req.body.contents.name === "" || req.body.contents.startTime === "" ||
        req.body.contents.endTime === "" || req.body.contents.days === "" ||
        req.body.contents.name == undefined || req.body.contents.startTime == undefined ||
        req.body.contents.endTime == undefined || req.body.contents.days == undefined
    ) {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });
    }

    let cls = new Class({
    	name: req.body.contents.name,
    	teacher: req.session.loginInfo._id,
    	students: [],
        startTime: req.body.contents.startTime,
        endTime: req.body.contents.endTime,
    	days: req.body.contents.days
    })
    cls.save( err => {
        if(err) throw err;
        return res.json({ success: true, data: cls });
    });
});

// Modify class
router.put('/:id', (req, res) => {

   // Check login status
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    }
    console.log(req.body.contents.name, req.body.contents.startTime === "", req.body.contents.endTime === "", req.body.contents.days === "")
    // Check if content is valid
    if(req.body.contents.name === "" || req.body.contents.startTime === "" ||
        req.body.contents.endTime === "" || req.body.contents.days === "" ||
        req.body.contents.name == undefined || req.body.contents.startTime == undefined ||
        req.body.contents.endTime == undefined || req.body.contents.days == undefined
    ) {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });
    }


    // Find Class
    Class.findById(req.params.id, (err, cls) => {
        console.log(cls, req.params.id)
        if(err) throw err;

        // IF Class does not exist
        if(cls == undefined) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 3
            });
        }

        // If exists, check teacher
        if(cls.teacher != req.session.loginInfo._id) {
            return res.status(403).json({
                error: "PERMISSION FAILURE",
                code: 4
            });
        }

        // Modify class contents
        cls.name = req.body.contents.name;
        cls.days = req.body.contents.days;
        cls.startTime = req.body.contents.startTime;
        cls.endTime = req.body.contents.endTime;
        cls.students = req.body.contents.students;
        console.log(cls);
        cls.save((err, cls) => {
            if(err) throw err;
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
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        });
    }

    // Check login status
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 2
        });
    }
    // Find memo by id
    Class.findById(req.params.id, (err, cls) => {
        if(err) throw err;
        if(!cls) {
            console.log('case 3');
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 3
            });
        }
        //check if teacher is valid
        if(cls.teacher != req.session.loginInfo._id) {
            console.log('case 4');
            return res.status(403).json({
                error: "PERMISSION FAILURE",
                code: 4
            });
        }

        // Remove class
        Class.remove({ _id: req.params.id }, err => {
            if(err) throw err;
            res.json({ success: true });
        });
    });
});

// Get class list
router.get('/', (req, res) => {
    Class.find()
    .exec((err, classes) => {
        if(err) throw err;
        res.json(classes);
    });
});

export default router;