import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { supabase } from '../trpc';

export const userRouter = router({
  getAll: protectedProcedure
    .query(async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name');
      
      if (error) throw error;
      return data;
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('id', input)
        .single();
      
      if (error) throw error;
      return data;
    })
});