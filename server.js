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
  });
const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.6,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
});
const Tour = mongoose.model('Tour', tourSchema);
const newTour = new Tour({
  name: 'THe show ',
  rating: 4.5,
  price: 600,
});
newTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR', err);
  });
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on ${port}...`);
});
