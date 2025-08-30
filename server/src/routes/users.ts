import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';
import { validateBody, validateQuery } from '../middleware/validation';
import { createUserSchema, updateUserSchema, listUsersQuerySchema } from '../validators/userValidators';

const router = Router();

router.get('/', validateQuery(listUsersQuerySchema), getUsers);
router.get('/:id', requireAuth, getUserById);
router.post('/', validateBody(createUserSchema), createUser);
router.put('/:id', requireAuth, validateBody(updateUserSchema), updateUser);
router.delete('/:id', requireAuth, deleteUser);

export default router;