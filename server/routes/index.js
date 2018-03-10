import test from './test';
import express from 'express';
import teacher from './teacher';
import student from './student';
import cls from './class';
import homework from './homework';
import lecture from './lecture';
import upload from './upload';
import download from './download';
import comment from './comment';

const router = express.Router();
router.use('/test', test);
router.use('/teacher', teacher);
router.use('/student', student);
router.use('/class', cls);
router.use('/homework', homework);
router.use('/lecture', lecture);
router.use('/upload', upload);
router.use('/download', download);
router.use('/comments', comment);

export default router;
