import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

beforeEach(() => {
  fakeUsersRepository = new FakeUsersRepository();
  fakeHashProvider = new FakeHashProvider();

  updateProfile = new UpdateProfileService(
    fakeUsersRepository,
    fakeHashProvider,
  );
});

// Describe é uma forma de organizar os testes, colocando um cabeçalho
describe('UpdateProfile', () => {
  it('should be able to update a profile', async () => {
    // Cria um novo usuario
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Mac',
      email: 'johnmac@example.com',
    });

    expect(updatedUser.name).toBe('John Mac');
    expect(updatedUser.email).toBe('johnmac@example.com');
  });

  it('should not be able to update profile of a non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-exist',
        name: 'John Doe Jr.',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile email for a used one', async () => {
    // Cria um novo usuario
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe Jr.',
      email: 'johnjr@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe Jr.',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update profile name without changing email', async () => {
    // Cria um novo usuario
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Doe Jr.',
      email: 'johndoe@example.com',
    });

    expect(updatedUser.name).toBe('John Doe Jr.');
    expect(updatedUser.email).toBe('johndoe@example.com');
  });

  it('should be able to update password', async () => {
    // Cria um novo usuario
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@example.com',
      old_password: '123456',
      password: '654321',
    });

    expect(updatedUser.password).toBe('654321');
  });

  it('should not be able to update password without previous password', async () => {
    // Cria um novo usuario
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password without valid previous password', async () => {
    // Cria um novo usuario
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
        old_password: '111111',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
