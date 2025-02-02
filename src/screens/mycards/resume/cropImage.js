

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // Prevents CORS issues
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
  });

export default async function getCroppedImg(imageSrc, pixelCrop) {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, "image/png");
    });
  } catch (error) {
    console.error("Error in cropping image:", error);
    throw error;
  }
}

// const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
//   const image = await createImage(imageSrc);
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   canvas.width = croppedAreaPixels.width;
//   canvas.height = croppedAreaPixels.height;

//   ctx.drawImage(
//     image,
//     croppedAreaPixels.x,
//     croppedAreaPixels.y,
//     croppedAreaPixels.width,
//     croppedAreaPixels.height,
//     0,
//     0,
//     croppedAreaPixels.width,
//     croppedAreaPixels.height
//   );

//   return new Promise((resolve, reject) => {
//     canvas.toBlob((blob) => {
//       if (!blob) {
//         reject(new Error("Canvas is empty"));
//         return;
//       }
//       const file = new File([blob], "cropped-image.png", { type: "image/png" });
//       resolve(URL.createObjectURL(file));
//     }, "image/png");
//   });
// };

// export default getCroppedImg;
