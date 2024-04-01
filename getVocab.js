const dotenv = await import("dotenv");
dotenv.config();
import fs from "fs";
//const fs = require("fs");

var apiToken = process.env.WK_KEY;
var apiEndpointPath = "subjects";
var requestHeaders = new Headers({
  Authorization: "Bearer " + apiToken,
});
var queryString = "?types=vocabulary,kana_vocabulary";
var next_url = "https://api.wanikani.com/v2/" + apiEndpointPath + queryString;

const getAPIResponse = async (endPoint) => {
  const response = await fetch(endPoint);
  const responseBody = await response.json();

  return responseBody;
};

const getAllVocab = async () => {
  const vocabObj = {};
  do {
    console.log(Object.keys(vocabObj).length);
    let apiEndpoint = new Request(next_url, {
      method: "GET",
      headers: requestHeaders,
    });

    let responseBody = await getAPIResponse(apiEndpoint);
    next_url = responseBody.pages.next_url;
    const data = responseBody.data;

    for (let i = 0; i < data.length; i++) {
      vocabObj[data[i].id] = {
        level: data[i].data.level,
        type: data[i].object,
        characters: data[i].data.characters,
      };
    }
  } while (next_url);

  return vocabObj;
};

const exportVocab = async () => {
  const vocabMap = await getAllVocab();
  // Convert to JSON
  const jsonData = JSON.stringify(vocabMap);

  // Write to a file
  fs.writeFile("vocabData.json", jsonData, (err) => {
    if (err) throw err;
    console.log("Data has been saved!");
  });
};

exportVocab();
