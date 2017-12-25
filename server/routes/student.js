import express from 'express';
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
});

router.post('/signin', (req, res) => {
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
        session.loginInfo = {
            _id: account._id,
            username: account.username
        };

        // RETURN SUCCESS
        return res.json({
            success: true
        });
    });
});

router.get('/getinfo', (req, res) => {
    if(typeof req.session.loginInfo === "undefined")
        return throwerror(res, 401, 'User not logged in.');

    res.json({ info: req.session.loginInfo });
});

router.put('/changepw/:id', (req, res)=>{
    // CHECK PASS LENGTH
    if(req.body.pw.length < 4 || typeof req.body.pw !== "string")
        return throwerror(res, 401, 'Login failed: password format not valid.');

    Student.findById(req.params.id, (err, std) => {
        if(err) return throwerror(res, 409, 'DB error.');
        // IF MEMO DOES NOT EXIST
        if(!std) return throwerror(res, 409);

        if(req.body.pw != req.body.check_pw)
            return throwerror(res, 401, 'Login failed: wrong password.');

        std.password = req.body.pw;
        std.password = std.generateHash(std.password);

        std.save((err, std) => {
            if(err) return throwerror(res, 409, 'DB error.');
            return res.json({
                success: true
            });
        });

    });
})

router.put('/:id', (req, res)=>{
    Student.findById(req.params.id, (err, std) => {
        if(err) return throwerror(res, 409, 'DB error.');
        // IF MEMO DOES NOT EXIST
        if(!std) return throwerror(res, 409);

        std.class = req.body.obj.class;
        std.name = req.body.obj.name;
        std.school = req.body.obj.school;
        std.level = req.body.obj.level;
        console.log(req.body.class);
        console.log(std);

        std.save((err, std) => {
            if(err) return throwerror(res, 409, 'DB error.');
            return res.json({
                success: true,
                std
            });
        });

    });
})



router.post('/logout', (req, res) => {
    req.session.destroy(err => { if(err) return throwerror(res, 409, 'DB error.'); });
    return res.json({ sucess: true });
});

router.delete('/:id', (req, res) => {
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
});


export default router;