//The function declared here are just for trying out at the moment. Feel free to remove and/or change them!

import { error } from "console";
import User from "../models/User";
import { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response) => {
  const { email, displayName, picture, salutation, password, hasPremiumSubscription, payments } = req.body;

  try {
    const newUser = new User({ email, displayName, picture, salutation, password, hasPremiumSubscription, payments });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error });
  }
};


