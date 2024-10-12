const fileModels = require("../models/fileModels");
const folderModels = require("../models/folderModels");
const timeFormat = require("../config/timeFormat");

async function getHome(req, res) {
  try {
    if (!req.isAuthenticated()) {
      res.render("home", { user: {}, files: [], folders: [] });
    } else {
      const user = req.user;

      const files = await fileModels.getFiles(user.id);

      const formattedFiles = files.map((file) => ({
        ...file,
        createdAt: timeFormat(file.createdAt),
      }));

      files.filter((file) => file.folderId == null);

      const folders = await folderModels.getFoldersByUserId(user.id);

      res.render("home", { user, files: formattedFiles, folders });
    }
  } catch (error) {
    res.status(500).render("error", {
      message: "Failed to load home page, try again later.",
    });
  }
}

module.exports = { getHome };
