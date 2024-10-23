const { deleteFolderFiles } = require("../config/services/supabaseFunctions");
const timeformat = require("../config/timeFormat");
const folderModels = require("../models/folderModels");

async function getNewFolderForm(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/user/login");
  }

  try {
    res.render("folderForm");
  } catch (error) {
    res.status(500).render("error", {
      message: "Failed to load form, try again later.",
    });
  }
}

async function postNewFolderForm(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/user/login");
  }

  try {
    const { id } = req.user;
    const { name } = req.body;

    await folderModels.createFolder(name, id);
    res.redirect("/");
  } catch (error) {
    res.status(500).render("error", {
      message: "Failed to create folder, try again later.",
    });
  }
}

async function getFolderDetail(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/user/login");
  }

  try {
    const user = req.user;
    const { id } = req.params;
    const folder = await folderModels.getFoldersByFolderId(Number(id));

    const formattedFolderDetail = [
      {
        ...folder[0],
        file: folder[0].file.map((file) => ({
          ...file,
          createdAt: timeformat(file.createdAt),
        })),
      },
    ];

    res.render("folderDetail", { user, folder: formattedFolderDetail[0] });
  } catch (error) {
    res.status(500).render("error", {
      message: "Failed to retrieve folder details, try again later.",
    });
  }
}

async function deleteFolder(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/user/login");
  }

  try {
    const { id } = req.params;
    const folderName = await folderModels.getFolderNameByFolderId(Number(id));
    await deleteFolderFiles(
      "file_uploader",
      `user${req.user.id}/${folderName.name}`
    );
    await folderModels.deleteFolder(Number(id));
    res.redirect("/");
  } catch (error) {
    res.status(500).render("error", {
      message: "Failed to delete folder, try again later.",
    });
  }
}

module.exports = {
  getNewFolderForm,
  postNewFolderForm,
  getFolderDetail,
  deleteFolder,
};
