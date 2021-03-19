import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

// Describe é uma forma de organizar os testes, colocando um cabeçalho
describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show a profile', async () => {
    // Cria um novo usuario
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const showUser = await showProfile.execute(user.id);

    expect(showUser.name).toBe('John Doe');
    expect(showUser.email).toBe('johndoe@example.com');
  });

  it('should not be able to show profile of non-existing user', async () => {
    await expect(showProfile.execute('Nao existente')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
