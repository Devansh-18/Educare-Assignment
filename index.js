import 'dotenv/config';
import express from 'express';
import schoolRoutes from './routes/schoolRoutes.js';

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());
app.use(schoolRoutes);

app.listen(PORT, () => {
  console.log(`App is listening on PORT ${PORT}`);
});