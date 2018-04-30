import express from 'express';
import Class from '../models/Class';
import mongoose from 'mongoose';

import iconv from 'iconv-lite';
import fs from 'fs';

import throwerror from './throwerror';

const router = express.Router();
router.post('/test', (req, res) =>{ createData(req, res) });
router.post('/', (req, res) =>{ createClass(req, res) });
router.put('/:id', (req, res) =>{ updateClass(req, res) });
router.delete('/:id', (req, res) =>{ deleteClass(req, res) });
router.get('/', (req, res) => { getAllClasses(req, res) });

const createData = (req, res) =>{
    console.log('test uri called');
    let data = fs.readFileSync('server/data/class.csv');
    data = iconv.decode(data, 'EUC-KR').split('\n');
    data.splice(data.length-1, 1);
    for(let i = 0; i < data.length; i++){
        let row = data[i].split(',');
        let proceed = false;
        Class.find({name: row[0]}, (err, checkcls) =>{
            if(JSON.stringify(checkcls) == JSON.stringify([])){
                let cls = new Class({
                    name: row[0],
                    teacher: row[1],
                    students: [],
                    startTime: row[2].replace(' ', ''),
                    endTime: row[3].replace(' ', ''),
                    days: row[4]
                })
                cls.save( err =>{
                    if(err) throw err;
                })
            }
        })
    }
}

const createClass = (req, res) => {
    //Check login status
    if(typeof req.session.loginInfo === 'undefined')
         return throwerror(res, 401, 'User not logged in.');

    // Check if content is valid
    if(!validateContents(req.body.contents))
        return throwerror(res, 400, 'Empty contents.');

    let cls = new Class({
        name: req.body.contents.name,
        teacher: req.session.loginInfo.user._id,
        students: [],
        startTime: req.body.contents.startTime,
        endTime: req.body.contents.endTime,
        days: req.body.contents.days
    })
    Class.findOne({ name: req.body.contents.name }, (err, exists) => {
        if (err) return throwerror(res, 409, 'DB error.');
        if(exists)
            return throwerror(res, 409, 'Class name already exists.');
        cls.save( err => {
            if(err) return throwerror(res, 409, 'DB error.');
            return res.json({ success: true, data: cls });
        });
    })
}

const updateClass = (req, res) => {
   // Check login status
    if(typeof req.session.loginInfo === 'undefined')
        return throwerror(res, 401, 'User not logged in.');

    // Check if content is valid
    if(!validateContents(req.body.contents))
        return throwerror(res, 400, 'Empty contents.');
    Class.findOne({ name: req.body.contents.name }, (err, exists) => {
        if (err) return throwerror(res, 409, 'DB error.');
        // if(exists)
            // return throwerror(res, 409, 'Class name already exists.');
            // Find Class
        Class.findById(req.params.id, (err, cls) => {
            if(err) return throwerror(res, 409, 'DB error.');
            // IF Class does not exist
            if(cls == undefined) return throwerror(res, 409);

            // If exists, check teacher
            if(cls.teacher != req.session.loginInfo.user._id)
                return throwerror(res, 403, 'Unauthorized user.');

            if(!cls.students.equals(req.body.contents.students)){
                console.log(cls.students.diff())
            }

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
    })

}

const deleteClass = (req, res) => {
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
        if(cls.teacher != req.session.loginInfo.user._id)
            return throwerror(res, 403, 'Unauthorized user.');

        // Remove class
        Class.remove({ _id: req.params.id }, err => {
            if(err) return throwerror(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
}

const getAllClasses = (req, res)  => {
    Class.find()
    .exec((err, classes) => {
        if(err) return throwerror(res, 409, 'DB error.');
        res.json(classes);
    });
} 

let verifyList = ['name', 'startTime', 'endTime', 'days'];
let validateContents = (contents, vfList = verifyList) =>{
    for(let i = 0; i < vfList.length; i++){
        let key = vfList[i];
        if(contents[key] == undefined || contents[key] == ''){
            console.error('value not found: ', key, contents[key]);
            return false;
        }
    }
    return true;
}

Array.prototype.equals = function (array) {
    if (!array) return false;
    if (this.length != array.length) return false;
    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] != array[i]) return false;
    }       
    return true;
}
Array.prototype.diff = function(a) {
    let first = this.filter(function(i) {return a.indexOf(i) < 0;});
    let second = a.filter(function(i) {return this.indexOf(i) < 0;});
    return [...first, ...second];
};
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

export default router;
