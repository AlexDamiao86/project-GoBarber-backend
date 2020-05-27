import { Router } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticationUser = new AuthenticateUserService();

  const { user, token } = await authenticationUser.execute({
    email,
    password,
  });

  // Nao retorna a senha na resposta
  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
