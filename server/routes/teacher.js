import express from 'express';
import Teacher from '../models/Teacher';
import Student from '../models/Student';
import throwerror from './throwerror';

const router = express.Router();


router.post('/signup', (req, res) => {
    // CHECK USERNAME FORMAT
    let usernameRegex = /^[a-z0-9]+$/;

    if(!usernameRegex.test(req.body.username))
        return throwerror(res, 400, 'Bad username.');

    // CHECK PASS LENGTH
    if(req.body.password.length < 4 || typeof req.body.password !== "string")
        return throwerror(res, 400, 'Bad password.');

    // CHECK USER EXISTANCE
    Teacher.findOne({ username: req.body.username }, (err, exists) => {
        if (err) return throwerror(res, 409, 'DB error.');
        if(exists)
            return throwerror(res, 409, 'Username already exists.');

        // CREATE ACCOUNT
        let account = new Teacher({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name
        });

        account.password = account.generateHash(account.password);

        // SAVE IN THE DATABASE
        account.save( err => {
            if(err) return throwerror(res, 409, 'DB error.');
            return res.json({ success: true });
        });

    });
});

router.post('/signin', (req, res) => {
    if(typeof req.body.password !== "string")
        return throwerror(res, 401, 'Login failed: password format not valid.');

    // FIND THE USER BY USERNAME
    Teacher.findOne({ username: req.body.username}, (err, account) => {
        if(err)  return throwerror(res, 409, 'DB error.');

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
            user: account,
            role: 'teacher'
        };
        // delete account.password;
        // RETURN SUCCESS
        return res.json({
            success: true,
            id: session.loginInfo,
        });
    });
});

router.get('/getinfo', (req, res) => {
    if(typeof req.session.loginInfo === "undefined")
        return throwerror(res, 401, 'User not logged in.');

    res.json({ info: req.session.loginInfo });
});

router.get('/getstudentsinfo', (req, res) =>{
    if(typeof req.session.loginInfo === "undefined")
        return throwerror(res, 401, 'User not logged in.');

    Student.find({}, (err, accounts) =>{
        return res.json({ info: accounts });
    })
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => { if(err) return throwerror(res, 409, 'DB error.'); });
    return res.json({ sucess: true });
});

export default router;
