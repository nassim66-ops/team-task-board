import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import { appRouter } from './router';
import { createContext } from './trpc';

// Create express app
const app = express();

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173'], // Allow your Vite frontend
  credentials: true,
}));

// Add TRPC middleware
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  })
);

// Start HTTP server
const server = app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

// Create WebSocket server for real-time functionality
const wss = new ws.Server({ server });
applyWSSHandler<AppRouter>({
  wss,
  router: appRouter,
  createContext: createContext,
});

export type AppRouter = typeof appRouter;