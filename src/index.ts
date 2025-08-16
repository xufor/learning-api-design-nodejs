import { app } from './server.ts';
import { ENV } from '../env.ts';

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});
