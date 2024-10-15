const fs = require("fs");
const supabase = require("../supabaseClient");

async function getBucketDetail() {
  const { data, error } = await supabase.storage.getBucket("file_uploader");
  return { data, error };
}

async function uploadFile(bucketName, fileName, filePath) {
  const fileStream = fs.createReadStream(filePath);

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, fileStream, {
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
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);
  console.log(data);

  return { error };
}

module.exports = {
  getBucketDetail,
  uploadFile,
  downloadFile,
  deleteFileFromSupabase,
};
