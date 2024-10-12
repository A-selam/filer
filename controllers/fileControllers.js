const path = require("path");
const timeFormat = require("../config/timeFormat");

const fileModels = require("../models/fileModels");

async function postFile(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/user/login");
  }

  try {
    const { originalname, path, size } = req.file;
    const { id } = req.user;
    if (req.params.id) {
      const folderId = req.params.id || null;
      await fileModels.postFile(originalname, path, size, id, Number(folderId));
      res.redirect("/");
    } else {
      await fileModels.postFile(originalname, path, size, id);
      res.redirect("/");
    }
  } catch (error) {
    res.status(500).render("error", {
      message: "Failed to upload file, try again later.",
    });
  }
}

function formatFileSize(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;

  // Continue dividing by 1024 until you find the appropriate unit
  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }

  // Return the file size formatted to one decimal place with the appropriate unit
  return `${bytes.toFixed(1)} ${units[unitIndex]}`;
}

async function getFile(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/user/login");
  }

  try {
    const user = req.user;
    const { id } = req.params;
    const file = await fileModels.getFile(Number(id));
    const formattedFile = {
      ...file,
      size: formatFileSize(file.size),
      createdAt: timeFormat(file.createdAt),
    };

    res.render("fileDetail", { file: formattedFile, user });
  } catch (error) {
    res.status(500).render("error", {
      message: "Failed to retrieve file, try again later.",
    });
  }
}

async function downloadFile(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/user/login");
  }

  try {
    const { repo, tempname } = req.params;
    res.download(path.join(__dirname, "/../", repo, tempname));
  } catch (error) {
    res.status(500).render("error", {
      message: "Failed to download file, try again later.",
    });
  }
}

async function deleteFile(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/user/login");
  }

  try {
    const { id } = req.params;
    await fileModels.deleteFile(Number(id));
    res.redirect("/");
  } catch (error) {
    res.status(500).render("error", {
      message: "Failed to delete file, try again later.",
    });
  }
}

module.exports = { postFile, getFile, downloadFile, deleteFile };
