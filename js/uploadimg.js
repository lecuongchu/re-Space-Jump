// uploadimg.js - chỉ giữ lại logic upload và export

// Upload ảnh từ file
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "SPCK_JSI");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/dxlsgtdtj/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();
  if (result.secure_url) {
    return result.secure_url;
  } else {
    throw new Error(result.error?.message || "Upload thất bại!");
  }
}

// Upload ảnh từ URL
async function uploadFromUrl(imageUrl) {
  const formData = new FormData();
  formData.append("file", imageUrl);
  formData.append("upload_preset", "SPCK_JSI");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/dxlsgtdtj/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();
  if (result.secure_url) {
    return result.secure_url;
  } else {
    throw new Error(result.error?.message || "Upload thất bại!");
  }
}

// 👉 Export một hàm chung (admin.js sẽ import cái này)
export async function uploadimg(input) {
  if (input instanceof File) {
    return await uploadToCloudinary(input);
  } else if (typeof input === "string") {
    return await uploadFromUrl(input);
  } else {
    throw new Error("Input không hợp lệ, phải là File hoặc URL string");
  }
}
