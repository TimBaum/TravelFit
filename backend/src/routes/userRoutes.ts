import { Router } from "express";
import { createUser, readUser, readAllUsers, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

router.post('/create', createUser);
router.get('/get/:id', readUser);
router.get('/get', readAllUsers);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

export default router;