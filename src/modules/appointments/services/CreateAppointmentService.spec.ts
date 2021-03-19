import { uuid } from 'uuidv4';
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

// Describe é uma forma de organizar os testes, colocando um cabeçalho
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const newId = uuid();

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: newId,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(newId);
  });

  it('should not be able to create two appointments at the same time', async () => {
    const appointmentDate = new Date();

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: uuid(),
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
