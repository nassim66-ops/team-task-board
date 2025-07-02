import { createTRPCReact } from '@trpc/react-query';
// import { AppRouter } from '../server/router';
import { httpBatchLink } from '@trpc/client';

export const trpc = createTRPCReact();
// export const trpc = createTRPCReact<AppRouter>();


export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});