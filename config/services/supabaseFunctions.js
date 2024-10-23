const fs = require("fs");
const supabase = require("../supabaseClient");

async function getBucketDetail() {
  const { data, error } = await supabase.storage.getBucket("file_uploader");
  return { data, error };
}

async function uploadFile(bucketName, userFolder, fileName, filePath) {
  const fileStream = fs.createReadStream(filePath);

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(`${userFolder}/${fileName}`, fileStream, {
      cacheControl: "3600",
      upsert: true,
      duplex: "half", // Set the duplex option explicitly
    });

  if (error) {
    throw error;
  }

  return data;
}

async function downloadFile(bucketName, fileName) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(fileName);

  if (error) {
    throw new Error(`Download failed: ${error.message}`);
  }

  return { data, error };
}

async function deleteFileFromSupabase(bucket, filePath) {
  filePath = filePath.replace("file_uploader/", "");
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);
  console.log("error" + error);
  console.log("data " + data);

  return { error };
}

async function deleteUserFiles(bucket, userFolder) {
  try {
    const { data: files, error: listError } = await supabase.storage
      .from("file_uploader") // Your bucket name
      .list(userFolder);

    if (listError) {
      throw listError; // Handle listing error
    }

    const deletePromises = files.map(async (file) => {
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([`${userFolder}/${file.name}`]); // Specify the full path

      if (deleteError) {
        throw deleteError; // Handle deletion error
      }
    });

    await Promise.all(deletePromises);
    console.log(
      `All files in folder '${userFolder}' have been deleted successfully.`
    );
  } catch (error) {
    console.error(`Failed to delete folder '${userFolder}': ${error.message}`);
  }
}

module.exports = {
  getBucketDetail,
  uploadFile,
  downloadFile,
  deleteFileFromSupabase,
  deleteUserFiles,
};
