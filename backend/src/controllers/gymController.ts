import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Gym from '../models/Gym';

const createGym = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const gym = new Gym({
        _id: new mongoose.Types.ObjectId(),
        name
    });

    return gym
        .save()
        .then((gym) => res.status(201).json({ gym }))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Gym.find()
        .then((gyms) => res.status(200).json({ gyms }))
        .catch((error) => res.status(500).json({ error }));
};

export default { readAll, createGym }