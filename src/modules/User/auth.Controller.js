const jwt = require("jsonwebtoken");
const User = require("./user.Model");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { promisify } = require("util");
const config = require("../../../config/config");


const signToken = (data) => {
  return jwt.sign({ data }, config.jwtSecret, {
    expiresIn: config.jwtEpiresIn,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const { password, ...rest } = user.toObject();
  const token = signToken(rest);
  res.status(statusCode).json({ status: "success", token, data: rest });
};

exports.signup = catchAsync(async (req, res, next) => {
  const checkEmail = await User.findOne({ email: req.body.email });
  if (checkEmail) {
    return next(new AppError("Email already exists", 400));
  }
  const user = await User.create({
    email: req.body.email,
    password: req.body.password,
  });

  res.status(201).json({ status: "Created" });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError("Please provide email and password!", 400));
  }
  const user = await User.findOne({ email })
  if (!user) {
    next(new AppError("Incorrect email !", 401));
  }
  if (!(await user.correctPassword(password, user.password))) {
    next(new AppError("Incorrect password !", 401));
  }
  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(
      new AppError(" You are Not logged in ! please log in to get access", 401)
    );
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.data);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer", 401)
    );
  }
  req.user = currentUser;
  next();
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
}


