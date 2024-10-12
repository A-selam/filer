const { Router } = require("express");
const passport = require("passport");
const userControllers = require("../controllers/userControllers");

const usersRouter = Router();

usersRouter
  .route("/signup")
  .get(userControllers.getSignUpForm)
  .post(userControllers.postSignUpForm);

usersRouter
  .route("/login")
  .get(userControllers.getLogInForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/user/signup",
    }),
    userControllers.postLogin
  );

usersRouter.route("/logout").get(userControllers.logout);

usersRouter.route("/delete/:id").get(userControllers.deleteUser);

module.exports = usersRouter;
