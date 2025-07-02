import { router } from './trpc';
import { authRouter } from './routers/auth';
import { taskRouter } from './routers/task';
import { userRouter } from './routers/user';

export const appRouter = router({
  auth: authRouter,
  task: taskRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;