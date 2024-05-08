import {getAllUsers, updateUser, deleteUser, getUser, deleteInactiveUsers } from '../controllers/user.controller.js';
import { uploadDocuments } from '../controllers/user.controller.js';
import express from 'express';
import upload from './upload.js'; 

const router = express.Router();


router.get('/', getAllUsers);

router.get('/:uid', getUser);

router.put('/:uid', updateUser);

router.delete('/:uid', deleteUser);

router.delete("/inactive", deleteInactiveUsers);

router.post('/:uid/documents', upload.array('documents'), uploadDocuments);

export default router;