import { Router } from 'express';
import appointmentsRouter from './appointments.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';

const routes = Router();

// Dessa maneira, quando informado a rota /appointments será direcionado para
// appointmentsRouter independente do tipo de método de requisição HTTP
routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
