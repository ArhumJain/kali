const Discord = require('discord.js');
const commandBase = require('../command-base');
const puppeteer = require('puppeteer');
// So we can access public methods and reference public variables from startchat.js
const startChat = require('./startchat');
const prefix = commandBase.getGuildPrefix();
module.exports = {
    commands: ['tellbot', 'tb'],
    expectedArgs: "[message]",
    minArgs: 1,
    permissions: [],
    requiredRoles: [],
    callback: async (message, arguments, text) =>{
        const browser = startChat.getBrowser();
        const page = startChat.getPage();
        let isChatStarted = startChat.getChatStarted();
        // Parse arguments and form a message object
        const messageToSendToBot = arguments.slice(0, arguments.length).join(' ');
        // Check if browser is open or not
        if(isChatStarted)
        {
            // Wait for input field to load and then send the message sent by user
            await page.type('#main-input > input', messageToSendToBot);
            await page.keyboard.press('Enter')
            await page.screenshot({path: 'kalichat.png'});
            // Evaluate every bot response which is a list of dynamic HTML elements under a common selector. We can just map each of this elements and obtain their inner text with
            // the last element in the array being the latest reply by the chatbot
            const listOfBotResponses = await page.$$eval('.pb-message > div > div', responses => responses.map(response => response.innerText));
            let botResponseToSend = listOfBotResponses[listOfBotResponses.length -1 ];
            if(listOfBotResponses[listOfBotResponses.length -1] == "I'm having fun talking with you. Do you want to set up an account so I can remember you?"){
                // After 3 user messages, the bot asks if the user wants to set up an account after responding to the user's third message. This means the second to last
                // element of our array containg the responses will have the proper response. In this case, we just check the 2nd to last element and ignore the precoded response
                // by the bot to set up an account. This works fine. Sry for long comment, kinda new to documenting my code well and such and I'm still writing a longer comment bruh.
                botResponseToSend = listOfBotResponses[listOfBotResponses.length - 2];
            }
            message.channel.send(botResponseToSend);
        }
        else{
            message.channel.send(`A chat session has not been started. Use \`${prefix}startchat\` or \`${prefix}sc\` to get started!`)
        }
    },
}