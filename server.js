const env = require('dotenv');
const mongoose = require('mongoose');

env.config({ path: './config.env' });
const app = require('./app');
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('Database has connected on 27017 port...');
  })
  .catch((err) => {
    console.log(err);
  });

const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on ${port}...`);
});
