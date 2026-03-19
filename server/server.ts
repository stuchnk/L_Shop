import express from 'express';
import cors from 'cors';
import { apiRouter } from './src/router/router';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use('/api', apiRouter);

app.listen(3000, () => {
  console.log('🚀 Server started on http://localhost:3000');
});
