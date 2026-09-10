import { Router } from 'express';
import healthRouter from './health';
import authRouter from './auth';
import usersRouter from './users';
import coursesRouter from './courses';
import batchesRouter from './batches';
import enrollmentsRouter from './enrollments';
import attendanceRouter from './attendance';
import assignmentsRouter from './assignments';
import gradesRouter from './grades';
import paymentsRouter from './payments';
import certificatesRouter from './certificates';
import messagesRouter from './messages';
import notificationsRouter from './notifications';
import announcementsRouter from './announcements';
import grievancesRouter from './grievances';
import reportsRouter from './reports';

const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/courses', coursesRouter);
apiRouter.use('/batches', batchesRouter);
apiRouter.use('/enrollments', enrollmentsRouter);
apiRouter.use('/attendance', attendanceRouter);
apiRouter.use('/assignments', assignmentsRouter);
apiRouter.use('/grades', gradesRouter);
apiRouter.use('/payments', paymentsRouter);
apiRouter.use('/certificates', certificatesRouter);
apiRouter.use('/messages', messagesRouter);
apiRouter.use('/notifications', notificationsRouter);
apiRouter.use('/announcements', announcementsRouter);
apiRouter.use('/grievances', grievancesRouter);
apiRouter.use('/reports', reportsRouter);

export default apiRouter;
