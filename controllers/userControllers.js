const bcrypt = require("bcryptjs");
const userModels = require("../models/userModels");
const {
  deleteUserFiles,
  deleteFolderFiles,
} = require("../config/services/supabaseFunctions");
const { getUserFoldersByUserId } = require("../models/folderModels");

async function getSignUpForm(req, res) {
  res.render("signup");
}

async function postSignUpForm(req, res) {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword }; // Corrected hashedPassword assignment

    await userModels.createUser(newUser);
    res.redirect("/user/login");
  } catch (error) {
    res.status(500).render("error", {
      message: "Failed to create new user, try again later.",
    });
  }
}

async function getLogInForm(req, res) {
  res.render("login");
}

function postLogin(req, res) {
  return res.redirect("/");
}

function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

async function deleteUser(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/user/login");
  }

  const { id } = req.params;
  try {
    const userFolders = await getUserFoldersByUserId(req.user.id);
    if (userFolders) {
      userFolders.map(async (folder) => {
        await deleteFolderFiles(
          "file_uploader",
          `user${req.user.id}/${folder.name}`
        );
      });
    }
    await deleteUserFiles("file_uploader", `user${id}`);
    await userModels.deleteUser(Number(id));
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).render("error", {
      message: "Failed to delete user, try again later.",
    });
  }
}

module.exports = {
  getSignUpForm,
  postSignUpForm,
  getLogInForm,
  postLogin,
  logout,
  deleteUser,
};
