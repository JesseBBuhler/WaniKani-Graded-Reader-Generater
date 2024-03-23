const fs = require("fs");

var apiToken = "b091ea2c-fd95-4d02-a07e-aab83ad14726";
var apiEndpointPath = "assignments";
var requestHeaders = new Headers({
  Authorization: "Bearer " + apiToken,
});
var queryString = "?subject_types=vocabulary,kana_vocabulary";
var apiEndpoint = new Request(
  "https://api.wanikani.com/v2/" + apiEndpointPath + queryString,
  {
    method: "GET",
    headers: requestHeaders,
  }
);

fetch(apiEndpoint)
  .then((response) => response.json())
  .then((responseBody) => {
    console.log(responseBody.data);
  });
