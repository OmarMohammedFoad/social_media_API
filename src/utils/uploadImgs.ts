import axios from "axios";

export default async function uploadImgs(img: string | undefined) {
  console.log("assssssssssssssssssssssssssss", img);

  try {
    if (!img) throw new Error("No image provided");

    const formData = new FormData();
    formData.append("image", img);
    console.log("asssssssssssssssssssssssssssssssssssssssssssssss");

    const res = await axios.post("https://api.imgbb.com/1/upload", formData, {
      params: {
        key: "7f37c717735d9ba2c96f735e9312dbee",
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(res);

    return res; // contains { url, etc. }
  } catch (error: any) {
    console.log("sssssssssssssss", error);

    console.error("Upload error:", error.response?.data || error.message);
    throw new Error(`Error while uploading image: ${error.message}`);
  }
}
