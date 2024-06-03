//The function declared here are just for trying out at the moment. Feel free to remove and/or change them!
// the "return" statements could be left out at some places, but for clarity I added them.
import { error } from "console";
import User from "../models/User";
import { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response) => {
  const { email, displayName, picture, salutation, password, hasPremiumSubscription, payments } = req.body;

  try {
    const newUser = new User({ email, displayName, picture, salutation, password, hasPremiumSubscription, payments });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json({ error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({user});
  } catch (err) {
    return res.status(500).json({ error });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json({users});
  } catch (err) {
    return res.status(500).json({ error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.set(req.body);
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error });
  }
};