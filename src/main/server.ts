import env from '@/main/config/env';
import { MongoHelper } from '@/infra/db/mongodb/helpers/MongoHelper';

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await (import('./config/app'))).default;

    app.listen(env.serverPort, () => console.log(`server running at port: ${env.serverPort}`));
  }).catch((err) => console.error(err));
