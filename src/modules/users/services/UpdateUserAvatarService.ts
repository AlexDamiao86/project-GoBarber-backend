import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    // Apenas usuários autenticados poderão atualizar o avatar
    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    // Se usuário já possuia um avatar
    if (user.avatar) {
      // Deletar avatar anterior
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      // fs é uma dependencia do node.js que trabalha com arquivos file-system
      // Funcao stat traz o status de um arquivo, caso ele exista.
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      // Caso arquivo exista, deleta-o
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
