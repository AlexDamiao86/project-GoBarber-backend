import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';

import AppError from '@shared/errors/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

// Todo service tem um unico metodo
class CreateAppointmentService {
  appointmentsRepository = getCustomRepository(AppointmentsRepository);

  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    // regra de negocio de negocio que determinada que a marcacao deverah
    // ocorrer em horas cheias 09:00, 10:00, 11:00

    const foundAppointmentAtSameHour = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (foundAppointmentAtSameHour) {
      throw new AppError(
        'Sorry, but there is an appointment already booked at this time.',
        400,
      );
    }

    // Cria apenas uma instancia do objeto a ser salvo
    const appointment = this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    // Salva efetivamente as alterações na base de dados
    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
