import api from "./axiosConfig";

export const detectDisease = async (
  farmerId,
  imageFile
) => {

  try {

    // Create FormData
    const formData = new FormData();

    // IMPORTANT:
    // "file" must match Flask backend
    formData.append(
      "file",
      imageFile
    );

    console.log(
      "Uploading Image:",
      imageFile
    );

    // API Request
    const response = await api.post(

      "http://127.0.0.1:5000/predict",

      formData,

      {
        timeout: 60000
      }
    );

    console.log(
      "Disease Prediction Response:",
      response.data
    );

    return response.data;

  } catch (error) {

    console.error(
      "Disease API Error:",
      error
    );

    // Backend Error
    if (error.response) {

      console.error(
        "Backend Response:",
        error.response.data
      );

      return {
        error:
          error.response.data.error ||
          "Backend Error"
      };
    }

    // Network Error
    return {
      error:
        "Server connection failed"
    };
  }
};