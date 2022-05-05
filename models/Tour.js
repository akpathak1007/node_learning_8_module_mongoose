const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
      minLength: 10,
      maxLength: 100,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    secreat: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    // 
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price ? true : false;
        },
        message: 'Discount can not be greater ({VALUE}) then price'
      }
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have max group size.'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have difficulty field'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Value can be either easy, medium and difficult. ',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have summary.'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Tour mush have Image cover.'],
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    ratingQuntity: {
      type: Number,
      default: 0,
    },
    images: [String],
    startDates: [Date],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coorginates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point', 
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        days: Number
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

/**
 * There are four types of middleware: DOCUMENT, QUERY, AGGREGATE & MODEL
 */
// todo: Document Middleware :
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});
tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next()
});

// todo: query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secreat: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  next()
});

// todo: Aggregate middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secreat: { $ne: true} } });
  next();
});
tourSchema.post('aggregate', function (doc, next) {
  next();
})
module.exports = mongoose.model('Tour', tourSchema);
