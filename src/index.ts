import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import indexRouter from './routes/index.ts';
import proxyRouter from './routes/fetch.ts';

const app = express();

app.use(express.json());
app.set('trust proxy', true);

const corsOptions = {
  // Testing mode: reflect any requesting origin.
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
};

// Use the new options in your app
app.use(cors(corsOptions));

app.use(morgan('combined'));

app.use('/', indexRouter);
// had to rename as my host does not support proxy as a route
app.use('/fetch', proxyRouter);

const portArgIndex = process.argv.indexOf('--port');
const portFromArg = portArgIndex > -1 ? process.argv[portArgIndex + 1] : undefined;
const PORT = Number(portFromArg || process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
