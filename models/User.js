const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    lowercase: true,
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

//mongoose hooks or also called as mongoose middlewares
// After/Before a certain action is done, we want to do something else, this is where mongoose hooks are used.
// this can be useful in hashing password before saving the data to the database.

//After(post) a document is saved("save"), execute the given function
// userSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next(); // call the next middleware
// });

//Before(pre) a document was saved, execute the following function
userSchema.pre("save", async function (next) {
  //here 'this' refers to the local User instance(before saving to the DB) we created in the routeController.js file
  // console.log(this);

  //hashing password
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// for more types of hooks, refers https://mongoosejs.com/docs/middleware.html

//static method to login a user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password"); // these messages can be accessed using error.message
  }
  throw Error("Incorrect Email");
};

module.exports = mongoose.model("user", userSchema);
