import test from './test';
import express from 'express';
import memo from './memo';
import teacher from './teacher';
import student from './student';
import cls from './class';
import hw from './homework';
import lecture from './lecture';
import upload from './upload';
import download from './download';

const router = express.Router();
router.use('/test', test);
router.use('/memo', memo);
router.use('/teacher', teacher);
router.use('/student', student);
router.use('/class', cls);
router.use('/homework', hw);
router.use('/lecture', lecture);
router.use('/upload', upload);
router.use('/download', download);

export default router;
