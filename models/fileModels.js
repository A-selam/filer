const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getFiles(ownerId) {
  try {
    return await prisma.file.findMany({
      where: { ownerId, folderId: null },
    });
  } catch (error) {
    console.error("Error retrieving files:", error);
    throw new Error("Failed to retrieve files");
  }
}

async function postFile(title, path, size, ownerId, folderId = null) {
  try {
    return await prisma.file.create({
      data: {
        title,
        path,
        size,
        ownerId,
        folderId,
      },
    });
  } catch (error) {
    console.error("Error posting file:", error.message);
    throw new Error("Failed to post file");
  }
}

async function getFile(id) {
  try {
    return await prisma.file.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error retrieving file:", error);
    throw new Error("Failed to retrieve file");
  }
}

async function deleteFile(id) {
  try {
    return await prisma.file.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
}

module.exports = { getFiles, postFile, getFile, deleteFile };
