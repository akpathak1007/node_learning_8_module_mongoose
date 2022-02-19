const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    secreat: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    priceDiscount: {
      type: Number,
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
  // console.log(this.pipeline());
  // this.aggregate({
  //   $match: {
  //     secreat: { $ne: true }
  //   }
  // });
  next();
});
tourSchema.post('aggregate', function (doc, next) {
  next();
})
module.exports = mongoose.model('Tour', tourSchema);
