const dotenv = await import("dotenv");
dotenv.config();
import { Configuration, OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.GPT_KEY,
});

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Say this is a test" }],
    model: "gpt-3.5-turbo",
  });

  console.log(chatCompletion.choices[0]?.message?.content);
}

main();
// const { Configuration, OpenAIApi } = require("openai");

// const configuration = new Configuration({
//   apiKey: process.env.GPT_KEY,
// });

// const openai = new OpenAIApi(configuration);

// input = "Hello chatgpt! how are you today?";

// async function callAPI(userInput) {
//   const chat_completion = await openai.createChatCompletion({
//     model: "gpt-4",
//     messages: [{ role: "user", content: userInput }],
//   });
//   console.log(chat_completion.data.choices[0].message.content);
// }

// callAPI(input);
