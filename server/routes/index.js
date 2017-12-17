import express from 'express';
import teacher from './teacher';
import student from './student';
import cls from './class';
import hw from './homework';
import lecture from './lecture';
import upload from './upload';

const router = express.Router();
router.use('/teacher', teacher);
router.use('/student', student);
router.use('/class', cls);
router.use('/homework', hw);
router.use('/lecture', lecture);
router.use('/upload', upload);

export default router;
