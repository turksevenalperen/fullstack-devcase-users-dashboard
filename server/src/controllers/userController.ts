import { Request, Response } from 'express';
import User from '../models/User';
import { Op } from 'sequelize';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = '', role, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let where: any = {};
    if (search && String(search).trim() !== "") {
      where = {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${String(search).trim()}%` } },
          { lastName: { [Op.iLike]: `%${String(search).trim()}%` } },
          { email: { [Op.iLike]: `%${String(search).trim()}%` } },
        ]
      };
      console.log('Arama where:', where);
    }
    if (role) where.role = role;
    if (status) where.status = status;

    if (req.query.parentId) {
      where.parentId = String(req.query.parentId);
    } else {
      where.parentId = null;
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      order: [[String(sort), String(order)]],
      offset,
      limit: Number(limit),
      include: [{ model: User, as: 'children' }],
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: User, as: 'children' }],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
  const user = await User.create(req.body);
  const created = await User.findByPk(user.id, { include: [{ model: User, as: 'children' }] });
  res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update(req.body);
  const updated = await User.findByPk(user.id, { include: [{ model: User, as: 'children' }] });
  res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err });
  }
};