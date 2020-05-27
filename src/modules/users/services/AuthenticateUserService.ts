import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    // O usuário deverá possuir o e-mail cadastrado
    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // Usuário existe
    // Confere se o password digitado é igual ao password cadastrado
    // Funcao compare verifica se um password nao criptografado - password
    // é igual a um password criptografado - user.password
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // Na função sign
    // Primeiro parametro são as informacoes que ficarao no payload do token
    // Segundo parametro é um secret que sua aplicacao para utilizar
    // Terceiro parametro são configurações do nosso token.
    //  - subject: informa qual usuario está logando na aplicação
    //  - expiresIn: tempo de expiracao do token em dias
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
