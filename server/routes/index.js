import express from 'express';
import teacher from './teacher';
import student from './student';

const router = express.Router();
router.use('/teacher', teacher);
router.use('/student', student);

export default router;