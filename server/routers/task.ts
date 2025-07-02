import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { supabase } from '../trpc';

export const taskRouter = router({
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      status: z.enum(['To Do', 'In Progress', 'Done']).default('To Do')
    }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...input,
          user_id: 'bcc2f672-367b-441f-bfbc-4cd71d0ddbeb' //TODO: to change this later
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      status: z.enum(['To Do', 'In Progress', 'Done']).optional(),
      assignee_id: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      console.log("🚀 ~ .mutation ~ updates:", updates)
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', input);
      
      if (error) throw error;
      return true;
    }),

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', input)
        .single();
      
      if (error) throw error;
      return data;
    })
});