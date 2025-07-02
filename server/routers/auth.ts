import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { supabase } from '../trpc';

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().min(2),
      password: z.string().min(6)
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            name: input.name
          }
        }
      });
      
      if (error) throw error;
      return data.user;
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6)
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password
      });
      
      if (error) throw error;
      return data.user;
    }),

  logout: publicProcedure
    .mutation(async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    }),

  getUser: publicProcedure
    .query(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    })
});