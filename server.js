const env = require('dotenv');
const mongoose = require('mongoose');

// ? Global unhandled exception
// process.on('uncaughtException', (err) => {
//   console.log(err.name, err.message);
//   console.log('Unhandled Promise Rejection');
//   process.exit(1);
// })
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
    maxPoolSize: 10,
  })
  .then((con) => {
    console.log('Database has connected on 27017 port...');
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(
    `${process.env.NODE_ENV.toUpperCase()} Server is listening on ${port}...`
  );
});

// ? Global unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   console.log(err.name, err.message);
//   console.log('Unhandled Promise Rejection');
//   server.close(() => {
//     process.exit(1);
//   });
// });
