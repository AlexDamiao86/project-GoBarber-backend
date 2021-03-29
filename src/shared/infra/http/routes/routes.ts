import { Router } from 'express';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordsRouter from '@modules/users/infra/http/routes/passwords.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import providersRouter from '@modules/appointments/infra/http/routes/providers.routes';

const routes = Router();

// Dessa maneira, quando informado a rota /appointments será direcionado para
// appointmentsRouter independente do tipo de método de requisição HTTP
routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordsRouter);
routes.use('/profile', profileRouter);
routes.use('/providers', providersRouter);

export default routes;
