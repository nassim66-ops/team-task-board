import { initTRPC } from '@trpc/server';
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Supabase environment variables not set!');
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  console.log("🚀 ~ protectedProcedure ~ ctx:", ctx)
  // if (!ctx.user) throw new Error('Not authenticated');
  return next();
});

// Create context
export async function createContext({ req }) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return { user: null };
  const { data: { user }, error } = await supabase.auth.getUser(token);
  console.log('👤 User from Supabase:', user);

  return { user };
}

export interface Context {
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
}