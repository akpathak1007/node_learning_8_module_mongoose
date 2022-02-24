const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
    maxLength: 50,
    minLength: 3
  },
  email: {
    required: true,
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'Please enter valid email.']
  },
  password: {
    required: true,
    type: String,
    select:false
  },
  confirmPassword: {
    required: true,
    type: String,
    validate: {
      validate: function (el) {
        return el === this.password ? true : false;
      },
      message: 'Confirm password must match with password.',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
