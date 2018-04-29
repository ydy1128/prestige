import express from 'express';
import Teacher from '../models/Teacher';
import Student from '../models/Student';
import throwerror from './throwerror';

const router = express.Router();


router.post('/signup', (req, res) => { userSignUp(req, res) });
router.post('/signin', (req, res) => { userSignIn(req, res) });
router.get('/getinfo', (req, res) => { getSessionData(req, res) });
router.put('/updateinfo', (req, res) =>{ updateUser(req, res) });

router.get('/getstudentsinfo', (req, res) =>{ getAllStudents(req, res) });
router.put('/changestudentpw/:id', (req, res)=>{ changeStudentPW(req, res) });
router.put('/changestudentinfo/:id', (req, res)=>{ changeStudentInfo(req, res) })

router.post('/logout', (req, res) => { userLogOut(req, res) });

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
}

const userSignIn = (req, res) => {
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
}

const getSessionData = (req, res) => {
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
            if(req.body.obj.password.length < 4 || typeof req.body.obj.password !== "string")
                return throwerror(res, 400, 'Bad password.');
            account.password = account.generateHash(req.body.obj.password);
        }
        for (let key in req.body.obj){
            if(key != 'password' && account.hasOwnProperty(key)){
                if(req.body.obj[key] == undefined || req.body.obj[key] == '')
                    return throwerror(res, 400, 'Bad contents.');
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

const getAllStudents = (req, res) => {
    if(typeof req.session.loginInfo === "undefined")
        return throwerror(res, 401, 'User not logged in.');

    Student.find({}, (err, accounts) =>{
        return res.json({ info: accounts });
    })
}

const changeStudentPW = (req, res) => {
    // CHECK PASS LENGTH
    if(req.body.pw.length < 4 || typeof req.body.pw !== "string")
        return throwerror(res, 401, 'Bad password.');

    Student.findById(req.params.id, (err, std) => {
        if(err) return throwerror(res, 409, 'DB error.');
        // IF MEMO DOES NOT EXIST
        if(!std) return throwerror(res, 409);

        if(req.body.pw != req.body.check_pw)
            return throwerror(res, 401, 'Passwords do not match.');

        std.password = req.body.pw;
        std.password = std.generateHash(std.password);

        std.save((err, std) => {
            if(err) return throwerror(res, 409, 'DB error.');
            return res.json({
                success: true
            });
        });

    });
}

const changeStudentInfo = (req, res) => {
    Student.findById(req.params.id, (err, std) => {
        if(err) return throwerror(res, 409, 'DB error.');
        // IF MEMO DOES NOT EXIST
        if(!std) return throwerror(res, 409, 'DB error.');


        if(!validateContents(req.body.obj, stdVerifyList)){
            return throwerror(res, 400, 'Bad contents.');
        }

        std.class = req.body.obj.class;
        std.name = req.body.obj.name;
        std.school = req.body.obj.school;
        std.level = req.body.obj.level;

        std.save((err, std) => {
            if(err) return throwerror(res, 409, 'DB error.');
            return res.json({
                success: true,
                std
            });
        });

    }); 
}


const userLogOut = (req, res) => {
    req.session.destroy(err => { if(err) return throwerror(res, 409, 'DB error.'); });
    return res.json({ sucess: true });
}

let verifyList = ['username', 'password', 'name'];
let stdVerifyList = ['name', 'school', 'level'];
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

export default router;
