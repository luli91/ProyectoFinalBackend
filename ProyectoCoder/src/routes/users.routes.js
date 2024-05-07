import { Router } from 'express';
import {getAllUsers, updateUser, deleteUser, getUser, deleteInactiveUsers } from '../controllers/user.controller.js';

const router = Router();

router.get('/', getAllUsers);

router.get('/:uid', getUser);

router.put('/:uid', updateUser);

router.delete('/:uid', deleteUser);

router.delete("/inactive", deleteInactiveUsers);

export default router;