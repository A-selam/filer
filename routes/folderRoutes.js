const { Router } = require("express");
const folderControllers = require("../controllers/folderControllers");

const folderRouter = Router();

folderRouter
  .route("/new")
  .get(folderControllers.getNewFolderForm)
  .post(folderControllers.postNewFolderForm);

folderRouter.route("/:id").get(folderControllers.getFolderDetail);

folderRouter.route("/delete/:id").get(folderControllers.deleteFolder);

module.exports = folderRouter;
