import express from 'express';
import controller from '../controllers/gymController';
import { Schemas, ValidateJoi } from '../middleware/joi';

const router = express.Router();

router.post('/create', ValidateJoi(Schemas.author.create), controller.createGym);
router.get('/get', controller.readAll);

export = router;