import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

// Middleware que verifica se o usuário esteja autenticado
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const upload = multer(uploadConfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post('/', usersController.create);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated, // verifica autenticacao usuario
  upload.single('avatar'), // realiza upload da imagem
  userAvatarController.update,
);

export default usersRouter;
