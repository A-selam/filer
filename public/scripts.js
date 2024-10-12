// Dialog handlers for profile, file upload, and folder creation
document.addEventListener("DOMContentLoaded", () => {
  const openProfileDialogButton = document.getElementById(
    "open-profile-dialog-btn"
  );
  const dialog = document.getElementById("profile-dialog");
  const closeProfileDialogButton = document.getElementById(
    "close-profile-dialog-btn"
  );

  // Open the profile dialog when the button is clicked
  openProfileDialogButton.addEventListener("click", () => {
    dialog.showModal();
  });
  closeProfileDialogButton.addEventListener("click", () => {
    dialog.close();
  });

  // Open the file upload dialog
  const openUploadFileDialogButton = document.getElementById(
    "open-upload-file-dialog-btn"
  );
  const uploadFileDialog = document.getElementById("upload-file-dialog");
  const closeUploadFileDialogButton = document.getElementById(
    "close-upload-file-dialog-btn"
  );

  openUploadFileDialogButton.addEventListener("click", () => {
    uploadFileDialog.showModal();
  });
  closeUploadFileDialogButton.addEventListener("click", () => {
    uploadFileDialog.close();
  });

  // Open the create folder dialog
  const openCreateFolderDialogButton = document.getElementById(
    "open-create-folder-dialog-btn"
  );
  const createFolderDialog = document.getElementById("create-folder-dialog");
  const closeCreateFolderDialogButton = document.getElementById(
    "close-create-folder-dialog-btn"
  );

  openCreateFolderDialogButton.addEventListener("click", () => {
    createFolderDialog.showModal();
  });
  closeCreateFolderDialogButton.addEventListener("click", () => {
    createFolderDialog.close();
  });
});
