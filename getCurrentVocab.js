require("dotenv").config();
const fs = require("fs");
const allVocab = require("./vocabData.js");

var apiToken = process.env.WK_KEY;
var apiEndpointPath = "assignments";
var requestHeaders = new Headers({
  Authorization: "Bearer " + apiToken,
});
var queryString =
  "?subject_types=vocabulary,kana_vocabulary&srs_stages=1,2,3,4,5,6,7,8,9";
var next_url = "https://api.wanikani.com/v2/" + apiEndpointPath + queryString;

const getAPIResponse = async (endPoint) => {
  const response = await fetch(endPoint);
  const responseBody = await response.json();

  return responseBody;
};

const getCurrentVocab = async () => {
  const myVocab = [];
  do {
    console.log(Object.keys(myVocab).length);
    let apiEndpoint = new Request(next_url, {
      method: "GET",
      headers: requestHeaders,
    });

    let responseBody = await getAPIResponse(apiEndpoint);
    next_url = responseBody.pages.next_url;
    const data = responseBody.data;

    for (let i = 0; i < data.length; i++) {
      myVocab.push(allVocab[data[i].data.subject_id].characters);
    }
  } while (next_url);

  return myVocab;
};

const exportVocab = async () => {
  const vocabList = await getCurrentVocab();
  console.log(vocabList.length);
  // Convert to JSON
  const jsonData = JSON.stringify(vocabList);
  // Write to a file
  fs.writeFile("myVocab.json", jsonData, (err) => {
    if (err) throw err;
    console.log("Data has been saved!");
  });
};

exportVocab();
