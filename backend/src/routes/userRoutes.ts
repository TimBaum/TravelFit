//The routes declared here are just for trying out at the moment. Feel free to remove and/or change them!

import { Router } from "express";
import { createUser, getUser } from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.get('/:id', getUser);
router.put("/:id");

export default router;