import { Configuration, OpenAIApi } from "openai";
import readlineSync from 'readline-sync';
import dotenv from "dotenv";
import colors from "colors";
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// ------------------------------------------------------------------------------------------------------------------------------------------//
const main = async () => {

    console.log(colors.bold.green('Welcome to the ShellChat !'));
    console.log(colors.bold.green('You can start chatting with the bot.'));
    let chatHistory = [];
    while (true) {
        const userQuestion = readlineSync.question(colors.yellow("You: "));

        try {
            const messages = chatHistory.map(([role, content]) => ({
                role,
                content
            }));
            messages.push({
                'role': 'user',
                'content': userQuestion
            });
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
            });
            const answer = completion.data.choices[0].message.content;
            if (userQuestion.toLowerCase() === "exit") {
                console.log(colors.green(`Bot: ${answer}`));
                return;
            }
            console.log(colors.green(`Bot: ${answer}`));
            chatHistory.push(['user', userQuestion]);
            chatHistory.push(['assistant', answer]);
        } catch (error) {
            console.log(colors.red(error));
        }
    }

}

main();
