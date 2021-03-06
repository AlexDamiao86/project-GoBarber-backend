import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

beforeEach(() => {
  fakeUsersRepository = new FakeUsersRepository();
  fakeStorageProvider = new FakeStorageProvider();

  updateUserAvatar = new UpdateUserAvatarService(
    fakeUsersRepository,
    fakeStorageProvider,
  );
});

// Describe é uma forma de organizar os testes, colocando um cabeçalho
describe('UpdateUserAvatar', () => {
  it('should be able to update an avatar', async () => {
    // Cria um novo usuario
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'teste.jpg',
    });

    expect(user.avatar).toBe('teste.jpg');
  });

  it('should not be able to update an avatar for a non-existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing user',
        avatarFilename: 'teste.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete previous avatar when updating it', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    // Cria um novo usuario
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'teste.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'teste2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('teste.jpg');
    expect(user.avatar).toBe('teste2.jpg');
  });
});
