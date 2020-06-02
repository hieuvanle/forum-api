const fs = require("fs");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploads = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        fs.unlinkSync(file);
        resolve({ url: result.secure_url, id: result.public_id });
      },
      { resource_type: "auto" }
    );
  });
};

const destroy = (id) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(id, (result) => {
      resolve(result);
    });
  });
};

module.exports = {
  uploads,
  destroy,
};
