// Xử lý upload ảnh lên Cloudinary

// Upload ảnh từ file người dùng chọn
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "SPCK_JSI"); // preset cấu hình sẵn

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/dxlsgtdtj/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();
  if (result.secure_url) {
    return result.secure_url; // trả về link ảnh thành công
  } else {
    throw new Error(result.error?.message || "Upload thất bại!");
  }
}

// Upload ảnh từ một URL có sẵn
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

// Hàm dùng chung: có thể nhận file hoặc URL string
// admin.js sẽ import hàm này để dùng
export async function uploadimg(input) {
  if (input instanceof File) {
    return await uploadToCloudinary(input);
  } else if (typeof input === "string") {
    return await uploadFromUrl(input);
  } else {
    throw new Error("Input không hợp lệ, phải là File hoặc URL string");
  }
}
