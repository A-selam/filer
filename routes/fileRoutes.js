const { Router } = require("express");

// this is for test purpose
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination folder
  },
  filename: (req, file, cb) => {
    // Use the original file name (but ensure it's safe by sanitizing)
    const originalName = file.originalname;
    cb(null, originalName); // Keep the original name
  },
});
const upload = multer({ storage: storage });

const fileControllers = require("../controllers/fileControllers");

const fileRouter = Router();

fileRouter
  .route("/new")
  .post(upload.single("newFile"), fileControllers.postFile);

fileRouter
  .route("/new/:id")
  .post(upload.single("newFile"), fileControllers.postFile);

fileRouter.route("/:id").get(fileControllers.getFile);

fileRouter.route("/download/:repo/:tempname").get(fileControllers.downloadFile);

fileRouter.route("/delete/:id").get(fileControllers.deleteFile);

module.exports = fileRouter;
