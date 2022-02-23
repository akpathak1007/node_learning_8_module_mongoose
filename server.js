const env = require('dotenv');
const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'production') {
  env.config({ path: './config-pro.env' });
} else {
  env.config({ path: './config.env' });
}

const app = require('./app');
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    maxPoolSize:10
  })
  .then((con) => {
    console.log('Database has connected on 27017 port...');
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is listening on ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Promise Rejection');
  server.close(() => {
    process.exit(1);
  });
});
