import express from 'express';
import Teacher from '../models/teacher';

const router = express.Router();

router.post('/signup', (req, res) => {
    Teacher.findOne({ username: req.body.username }, (err, exists) => {
        if (err) throw err;
        // FIND IF USER EXISTS
        if(exists){
            return res.status(409).json({
                error: "USERNAME EXISTS",
                code: 1
            });
        }

        // CREATE TEACHER ACCOUNT
        let account = new Teacher({
            username: req.body.username,
            password: req.body.password,
		    name:  req.body.name,
    		classes:  req.body.classes
        });

        account.password = account.generateHash(account.password);

        // SAVE IN THE DATABASE
        account.save( err => {
            if(err) throw err;
            return res.json({ success: true });
        });

    });
    res.json({ success: true });
});

router.post('/signin', (req, res) => {
    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    // FIND THE USER BY USERNAME
    Teacher.findOne({ username: req.body.username}, (err, account) => {
        if(err) throw err;

        // CHECK ACCOUNT EXISTANCY
        if(!account) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        // CHECK WHETHER THE PASSWORD IS VALID
        if(!account.validateHash(req.body.password)) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

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
    res.json({ success: true });
});

router.get('/getinfo', (req, res) => {
    if(typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }

    res.json({ info: req.session.loginInfo });
});
router.post('/logout', (req, res) => {
    req.session.destroy(err => { if(err) throw err; });
    return res.json({ sucess: true });
});

export default router;