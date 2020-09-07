const User = require("../models/User");
const jwt = require("jsonwebtoken");

//handling errors
const handleErrors = (err) => {
  let errors = { email: "", password: "" }; //the error messages will be hold in this object

  //incorrect login error handling
  if (err.message === "Incorrect Email") {
    errors.email = "Email not registered";
    return errors;
  }
  if (err.message === "Incorrect Password") {
    errors.password = "Incorrect Password";
    return errors;
  }

  //duplicate error handling
  if (err.code === 11000) {
    //when unqiue is specified, if the unique validation fails, error code 11000 is returned
    errors.email = "Email already registered";
    return errors;
  }

  //user validation error handling
  if (err.message.includes("user validation failed")) {
    //Object.values returns an iterable array of the provided object
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    return errors;
  }
};

const maxAge = 1 * 24 * 60 * 60; //expire age of cookie

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: maxAge,
  });
};

exports.signup_get = function (req, res, next) {
  res.render("signup");
};

exports.signup_post = async function (req, res, next) {
  const { email, password } = req.body;
  try {
    //User.create makes the document, saves the document in the DB and also returns the User object
    const user = await User.create({ email, password });

    //creating the jwt token
    const token = createToken(user._id);
    //sending the cookie with token in it
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); //when in production, add 'secure:true' for https

    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

exports.login_get = function (req, res, next) {
  res.render("login");
};

exports.login_post = async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

exports.dashboard = function (req, res, next) {
  res.render("dashboard");
};

exports.logout_get = function (req, res) {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
