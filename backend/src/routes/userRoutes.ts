import { Router } from "express";
import { createUser, getUser, getAllUsers, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

router.post('/create', createUser);
router.get('/get/:id', getUser);
router.get('/get/', getAllUsers);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

export default router;