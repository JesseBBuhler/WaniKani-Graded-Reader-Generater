const fetch = require("node-fetch");
const fs = require("fs");
const FormData = require("form-data");

// Replace 'your_openai_api_key' with your actual OpenAI API key
const OPENAI_API_KEY = process.env.GPT_KEY;

// Path to the file you want to upload
const filePath = "myVocab.json";

// Prepare the file stream
const fileStream = fs.createReadStream(filePath);

// Create a form and append the file
const form = new FormData();
form.append("file", fileStream);
form.append("purpose", "fine-tune"); // or 'search', depending on your use case

// OpenAI API endpoint for file uploads
const OPENAI_URL = "https://api.openai.com/v1/files";

async function uploadFile() {
  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: form,
    });

    const data = await response.json();

    if (response.ok) {
      // Successfully uploaded the file
      console.log("File uploaded successfully:", data);
      console.log("File ID:", data.id); // This is the ID you'll use in API calls
    } else {
      // Handle errors
      console.error("File upload failed:", data);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

uploadFile();
