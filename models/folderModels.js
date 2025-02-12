const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getFoldersByUserId(userId) {
  try {
    return await prisma.folder.findMany({
      where: { ownerId: userId },
      include: { file: true },
    });
  } catch (error) {
    console.error("Error retrieving folders by user ID:", error);
    throw new Error("Failed to retrieve folders");
  }
}

async function createFolder(name, ownerId) {
  try {
    return await prisma.folder.create({
      data: {
        name,
        ownerId,
      },
    });
  } catch (error) {
    console.error("Error creating folder:", error);
    throw new Error("Failed to create folder");
  }
}

async function getFoldersByFolderId(id) {
  try {
    return await prisma.folder.findMany({
      where: { id },
      include: { file: true },
    });
  } catch (error) {
    console.error("Error retrieving folder by folder ID:", error);
    throw new Error("Failed to retrieve folder");
  }
}

async function getFolderNameByFolderId(id) {
  try {
    return await prisma.folder.findUnique({
      where: { id },
      select: { name: true },
    });
  } catch (error) {
    console.error("error retrieving folder name by folder ID:", error);
    throw new Error("Failed to add to folder.");
  }
}

async function getUserFoldersByUserId(userId) {
  try {
    return await prisma.folder.findMany({
      where: { ownerId: userId },
      select: { name: true },
    });
  } catch (error) {
    console.error("Error retrieving folders with user ID:", error);
    throw new Error("Faild to delete user.");
  }
}

async function deleteFolder(id) {
  try {
    return await prisma.folder.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw new Error("Failed to delete folder");
  }
}

module.exports = {
  getFoldersByUserId,
  createFolder,
  getFoldersByFolderId,
  deleteFolder,
  getFolderNameByFolderId,
  getUserFoldersByUserId,
};
