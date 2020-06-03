import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}

// Todo service tem um unico metodo
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
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
    // Salva efetivamente as alterações na base de dados
    const appointment = this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
