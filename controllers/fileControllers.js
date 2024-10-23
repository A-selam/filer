const paths = require("path");

const fs = require("fs");

const timeFormat = require("../config/timeFormat");
const supabaseFunctions = require("../config/services/supabaseFunctions");

const fileModels = require("../models/fileModels");
const { getFolderNameByFolderId } = require("../models/folderModels");

async function postFile(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/user/login");
  }
  let filePath = "";
  try {
    const { originalname, path, size } = req.file;
    const { id } = req.user;
    filePath = paths.join(__dirname, "/../", path);

    if (req.params.id) {
      const folderId = req.params.id;
      const folderName = await getFolderNameByFolderId(Number(folderId));
      const uploadResponse = await supabaseFunctions.uploadFile(
        "file_uploader",
        `user${id}`,
        folderName.name,
        req.file.originalname,
        filePath
      );

      // Save file details to database
      await fileModels.postFile(
        originalname,
        uploadResponse.fullPath,
        size,
        id,
        Number(folderId)
      );

      // Delete the file after successful upload and DB save
      fs.unlinkSync(filePath);

      res.redirect("/");
    } else {
      const uploadResponse = await supabaseFunctions.uploadFile(
        "file_uploader",
        `user${id}`,
        ".",
        req.file.originalname,
        filePath
      );

      // Save file details to database
      await fileModels.postFile(
        originalname,
        uploadResponse.fullPath,
        size,
        id
      );

      // Delete the file after successful upload and DB save
      fs.unlinkSync(filePath);

      res.redirect("/");
    }
  } catch (error) {
    try {
      if (filePath != "") {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.log(err.message);
    }

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
    const { repo, tempname } = req.params; // repo is the bucket, tempname is the file name

    // Download the file from Supabase
    const { data, error } = await supabaseFunctions.downloadFile(
      repo,
      tempname
    );

    // Check if there's an error or if data is missing
    if (error) {
      console.error("Supabase download error: ", error);
      return res.status(500).render("error", {
        message: "Failed to download file, try again later.",
      });
    }

    if (!data) {
      return res.status(404).render("error", {
        message: "File not found.",
      });
    }

    // Log to see what is being returned
    // console.log("File data from Supabase: ", data);

    // Convert Blob to ArrayBuffer and then to Buffer
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Set headers for the file download
    res.setHeader("Content-Disposition", `attachment; filename="${tempname}"`);
    res.setHeader("Content-Type", data.type || "application/octet-stream");

    // Send the file as a buffer
    res.send(buffer);
  } catch (error) {
    console.error("Download file error: ", error);
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

    // Retrieve file details (e.g., filename) from the database
    const file = await fileModels.getFile(Number(id));
    if (!file) {
      return res.status(404).render("error", {
        message: "File not found.",
      });
    }

    const { path } = file; // Assuming `filePath` contains the full path or filename stored in Supabase

    // Delete the file from Supabase storage
    const { error: supabaseError } =
      await supabaseFunctions.deleteFileFromSupabase("file_uploader", path);
    console.log(path);

    if (supabaseError) {
      console.error("Supabase delete error: ", supabaseError);
      return res.status(500).render("error", {
        message: "Failed to delete file from storage, try again later.",
      });
    }

    // Delete the file record from the local database
    await fileModels.deleteFile(Number(id));

    // Redirect to home page after successful deletion
    res.redirect("/");
  } catch (error) {
    console.error("File deletion error: ", error);
    res.status(500).render("error", {
      message: "Failed to delete file, try again later.",
    });
  }
}

module.exports = { postFile, getFile, downloadFile, deleteFile };
