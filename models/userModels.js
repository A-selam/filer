const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createUser({ email, name, password }) {
  try {
    return await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

async function passportQueryEmail(email) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Error querying user by email:", error);
    throw new Error("Failed to retrieve user by email");
  }
}

async function passportQueryId(id) {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error querying user by ID:", error);
    throw new Error("Failed to retrieve user by ID");
  }
}

async function deleteUser(id) {
  try {
    return await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}

module.exports = {
  createUser,
  passportQueryEmail,
  passportQueryId,
  deleteUser,
};
