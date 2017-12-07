import express from 'express';
import Student from '../models/Student';

const router = express.Router();

router.post('/signup', (req, res) => {
    // CHECK USERNAME FORMAT
    let usernameRegex = /^[a-z0-9]+$/;

    if(!usernameRegex.test(req.body.username)) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    // CHECK PASS LENGTH
    if(req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    // CHECK USER EXISTANCE
    Student.findOne({ username: req.body.username }, (err, exists) => {
        if (err) throw err;
        if(exists){
            return res.status(409).json({
                error: "USERNAME EXISTS",
                code: 3
            });
        }

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
            if(err) throw err;
            return res.json({ success: true });
        });

    });
});

router.post('/signin', (req, res) => {

    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    // FIND THE USER BY USERNAME
    Student.findOne({ username: req.body.username}, (err, account) => {
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
});

router.get('/getinfo', (req, res) => {
    if(typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }

    res.json({ info: req.session.loginInfo });
});

router.put('/:id', (req, res)=>{
    Student.findById(req.params.id, (err, std) => {
        if(err) throw err;

        // IF MEMO DOES NOT EXIST
        if(!std) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 4
            });
        }

        console.log(std);
        console.log(req.body.obj);
        std.class = req.body.obj.class;
        std.name = req.body.obj.name;
        std.school = req.body.obj.school;
        std.level = req.body.obj.level;
        console.log(req.body.class);
        console.log(std);

        std.save((err, std) => {
            if(err) throw err;
            return res.json({
                success: true,
                std
            });
        });

    });
})

router.post('/logout', (req, res) => {
    req.session.destroy(err => { if(err) throw err; });
    return res.json({ sucess: true });
});

router.delete('/:id', (req, res) => {
    // Check id Validity
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
    // Find student by id
    Student.findById(req.params.id, (err, std) => {
        if(err) throw err;
        if(!std) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 3
            });
        }

        // Remove student
        Student.remove({ _id: req.params.id }, err => {
            if(err) throw err;
            res.json({ success: true });
        });
    });
});


export default router;