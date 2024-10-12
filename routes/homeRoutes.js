const { Router } = require("express");
const homeControllers = require("../controllers/homeControllers");

const homeRouter = Router();

homeRouter.route("/").get(homeControllers.getHome);

module.exports = homeRouter;
