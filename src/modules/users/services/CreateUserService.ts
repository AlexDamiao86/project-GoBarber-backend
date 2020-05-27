import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    // Dois usuários não podem ter o mesmo e-mail cadastrado.
    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email address has been already used.', 400);
    }

    // Criptografa a senha recebida
    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
