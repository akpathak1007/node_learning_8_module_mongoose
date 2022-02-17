const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
/* Reading tours data from a json file */
const jsonFile = `${__dirname}/dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

// create a new tour
app.post('/api/v1/tour', (req, res) => {
  const body = req.body;
  const id = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign(body, { id });
  // Alternative way to do above tark
  const newTour = { ...body, id };
  tours.push(newTour);
  fs.writeFile(jsonFile, JSON.stringify(tours), (err) => {
    res.status(201).json({
      result: 'success',
      data: {
        tour: newTour,
      },
    });
  });
});

// Todo: Get a single tours
/* To define default params using ? . example /api/v1/tours/:id/userId?  */
app.get('/api/v1/tours/:id/:userId?', (req, res) => {
  const { id, userId } = req.params;
  console.log(userId);
  const tour = tours.find((el) => el.id === id*1);
  if (!tour) {
    return res.status(404).json({
      status: 'success',
      message: 'Invalid ID'
    })
  }
  return res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// Todo: Get all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

// Todo: Update a tour
app.patch('/api/v1/tours/:id', (req, res) => {
  try {
    const { id } = req.body.params;
    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Update successfully.',
      data: {
        tour: `<Updated tours with id ${id} is here...>`
      }
    })
  } catch (err) {
    return res.status(412).json({
      status: 'ERROR',
      message: err.message,
      data: null
    })
  }
})

// Todo: Delete tour
app.delete('/api/v1/tours/:id', (req, res) => {
  return res.status(204).json({
    status: 'SUCCESS',
    data: null   
  })
})
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on ${port}...`);
});
