const fs = require('fs');
const mognoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/Tour');

dotenv.config({ path: './config.env' });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
mognoose.connect(
  process.env.DATABASE,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) => {
    console.log('Database is connected!');
  }
);

/* IMPORT DATA */
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data imported successfully.');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
/* DELETE DATA */
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully.');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
