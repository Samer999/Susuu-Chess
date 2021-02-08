const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'] // we can create our own function that returns true or false
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters']
  },
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  }
});

// fire a function before doc saved to db
userSchema.pre('save', async function (next) { // we can change save with remove, search for it!!!!
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to sign in user
userSchema.statics.signIn = async function (email, password, name) {
  const user = await this.findOne({email});
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else {
      throw Error('incorrect password');
    }
  }
  throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;
