import OpenAI from "openai";
const dotenv = await import("dotenv");
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.GPT_KEY });

async function main() {
  const assistant = await openai.beta.assistants.create({
    name: "Turtle Tutor",
    instructions:
      "You are a writer and language teacher that writes short stories in Japanese at the vocabulary level of the user as determined by the myVocab.json file.  You then prompt the user to engage with the story by asking follow up questions about the story and evaluating their responses. After writing the story, you should also generate an image that represents the main theme of the story as if it were the cover of a picture book for the story you have just written. Use basic grammar whenever possible and keep additional words outside of the list provided to a minimum.",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4",
    file_ids: ["file-9yASnzPpU07MlvwJVW9eq9Sv"],
  });

  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: "Hello! Can you write me a story?",
  });

  const run = openai.beta.threads.runs
    .createAndStream(thread.id, {
      assistant_id: assistant.id,
    })
    .on("textCreated", (text) => process.stdout.write("\nassistant > "))
    .on("textDelta", (textDelta, snapshot) =>
      process.stdout.write(textDelta.value)
    )
    .on("toolCallCreated", (toolCall) =>
      process.stdout.write(`\nassistant > ${toolCall.type}\n\n`)
    )
    .on("toolCallDelta", (toolCallDelta, snapshot) => {
      if (toolCallDelta.type === "code_interpreter") {
        if (toolCallDelta.code_interpreter.input) {
          process.stdout.write(toolCallDelta.code_interpreter.input);
        }
        if (toolCallDelta.code_interpreter.outputs) {
          process.stdout.write("\noutput >\n");
          toolCallDelta.code_interpreter.outputs.forEach((output) => {
            if (output.type === "logs") {
              process.stdout.write(`\n${output.logs}\n`);
            }
          });
        }
      }
    });
}

main();
