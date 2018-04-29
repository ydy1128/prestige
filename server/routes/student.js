import express from 'express';
import Student from '../models/Student';
import Class from '../models/Class';
import throwerror from './throwerror';

import iconv from 'iconv-lite';
import fs from 'fs';

const router = express.Router();

router.post('/test', (req, res)=>{ createData(req, res) });
router.post('/signup', (req, res) => { userSignUp(req, res) });
router.post('/signin', (req, res) => { userSignIn(req, res) });
router.get('/getinfo', (req, res) => { getSessionData(req, res) });
router.put('/updateinfo', (req, res) =>{ updateUser(req, res) });
router.post('/logout', (req, res) => { userLogOut(req, res) });
router.delete('/:id', (req, res) => { deleteUser(req, res) });

const createData = (req, res) =>{
    console.log('test uri called');
    let data = fs.readFileSync('server/data/students.csv');
    data = iconv.decode(data, 'EUC-KR').split('\n');
    data.splice(data.length-1, 1);
    for(let i = 0; i < data.length; i++){
        let row = data[i].split(',');
        let proceed = false;
        Student.find({username: row[0]}, (err, std) =>{
            Class.find({name: row[4]}, (err, cls) =>{
                if(JSON.stringify(std) == JSON.stringify([]) && JSON.stringify(cls) != JSON.stringify([])){
                    console.log(cls._id);
                    let account = new Student({
                        username: row[0],
                        password: row[1],
                        name: row[2],
                        school: row[3],
                        level: row[5],
                        class: '',
                    });
                    account.class = cls[0]._id;
                    account.password = account.generateHash(row[1]);
                    account.save( err => {
                        if(err) throw err;
                    });
                    console.log(cls[0].students);
                    cls[0].students.push(account._id);
                    cls[0].save( err=>{
                        if(err) throw err;
                    })
                }            
            })

        })
    }  
}

const userSignUp = (req, res) => {
    // CHECK USERNAME FORMAT
    let usernameRegex = /^[a-z0-9]+$/;
    if(!validateContents(req.body))
        return throwerror(res, 400, 'Empty content exists.');
    if(!usernameRegex.test(req.body.username) || req.body.username.length < 4)
        return throwerror(res, 400, 'Bad username.');

    // CHECK PASS LENGTH
    if(req.body.password.length < 4 || typeof req.body.password !== "string")
        return throwerror(res, 400, 'Bad password.');

    // CHECK USER EXISTANCE
    Student.findOne({ username: req.body.username }, (err, exists) => {
        if (err) return throwerror(res, 409, 'DB error.');
        if(exists)
            return throwerror(res, 409, 'Username already exists.');
        // CREATE ACCOUNT
        let account = new Student({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            school: req.body.school,
            level: req.body.level,
            class: ''
        });
        account.password = account.generateHash(account.password);

        // SAVE IN THE DATABASE
        account.save( err => {
            if(err) return throwerror(res, 409, 'DB error.');
            return res.json({ success: true });
        });
    });
}

const userSignIn = (req, res) => {
    if(typeof req.body.password !== "string")
        return throwerror(res, 401, 'Login failed: password format not valid.');

    // FIND THE USER BY USERNAME
    Student.findOne({ username: req.body.username}, (err, account) => {
        if(err) return throwerror(res, 409, 'DB error.');

        // CHECK ACCOUNT EXISTANCY
        if(!account)
            return throwerror(res, 401, 'Login failed: account does not exist.');

        // CHECK WHETHER THE PASSWORD IS VALID
        if(!account.validateHash(req.body.password))
            return throwerror(res, 401, 'Login failed: wrong password.');

        // ALTER SESSION
        let session = req.session;
        account.password = '';
        session.loginInfo = {
            role: 'student',
            user: account,
        };
        
        // RETURN SUCCESS
        return res.json({
            success: true,
            id: session.loginInfo,
        });
    });
}


const getSessionData = (req, res) =>{
    if(typeof req.session.loginInfo === "undefined")
        return throwerror(res, 401, 'User not logged in.');

    res.json({ info: req.session.loginInfo });
}

const updateUser = (req, res) =>{
    if(typeof req.session.loginInfo === "undefined")
        return throwerror(res, 401, 'User not logged in.');
    console.log(req.session.loginInfo.user._id)
    Teacher.findById(req.session.loginInfo.user._id , (err, account) => {
        if(req.body.obj.password != ''){
            if(req.body.password.length < 4 || typeof req.body.password !== "string")
                return throwerror(res, 400, 'Bad password.');
            account.password = account.generateHash(req.body.obj.password);
        }
        for (let key in req.body.obj){
            if(key != 'password' && account.hasOwnProperty(key)){
                account[key] = req.body.obj[key];
            }
        }
        account.save((err, account) => {
            if(err) return throwerror(res, 409, 'DB error.');
            // ALTER SESSION
            let session = req.session;
            account.password = '';
            session.loginInfo = {
                user: account,
                role: 'teacher'
            };
            // RETURN SUCCESS
            return res.json({
                success: true,
                account: session.loginInfo,
            });
        })
    });
}

const userLogOut = (req, res) =>{
    req.session.destroy(err => { if(err) return throwerror(res, 409, 'DB error.'); });
    return res.json({ sucess: true });  
}

const deleteUser = (req, res) =>{
    // Check login status
    if(typeof req.session.loginInfo === 'undefined')
        return throwerror(res, 401, 'User not logged in.');
    // Find student by id
    Student.findById(req.params.id, (err, std) => {
        if(err) return throwerror(res, 409, 'DB error.');
        if(!std) return throwerror(res, 409);

        // Remove student
        Student.remove({ _id: req.params.id }, err => {
            if(err) return throwerror(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
}

let verifyList = ['username', 'password', 'name', 'school'];
let validateContents = (contents) =>{
    for(let i = 0; i < verifyList.length; i++){
        let key = verifyList[i];
        if(contents[key] == undefined || contents[key] == ''){
            console.error('value not found: ', key, contents[key]);
            return false;
        }
    }
    return true;
}


export default router;