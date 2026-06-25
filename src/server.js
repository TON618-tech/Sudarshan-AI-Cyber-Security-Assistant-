import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`Cyber Rabbit backend is running on port ${env.port}`);
});
