import { Router } from 'express';

// Middleware que verifica se o usuário esteja autenticado
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);
profileRouter.put('/', profileController.update);
profileRouter.get('/', profileController.show);

export default profileRouter;
