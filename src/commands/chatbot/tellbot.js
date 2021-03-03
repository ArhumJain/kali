const Discord = require('discord.js');
const commandBase = require('../command-base');
const puppeteer = require('puppeteer');
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
        const messageToSendToBot = arguments.slice(0, arguments.length).join(' ');
        console.log(messageToSendToBot);
        if(isChatStarted)
        {
            message.channel.send("You sent Kali the message: " + messageToSendToBot);
            let listOfBotResponses;
            await page.type('#main-input > input', messageToSendToBot);
            await page.keyboard.press('Enter');
            const stuff = await page.evaluate((sel) => {
                let elements = Array.from(document.querySelectorAll(sel));
                let responses = elements.map(element => {
                    return element.innerText;
                })
                return responses;
            }, ".pb-chat-bubble pb-chat-bubble__bot");
            console.log(stuff);
            // await page.screenshot({path: 'kalichat.png'});
            // await page.waitForXPath("");
            // await page.screenshot({path: 'kukichat.png'});
            // isChatStarted = false;
            // browser.close();
        }
        else{
            message.channel.send(`A chat session has not been started. Use \`${prefix}startchat\` or \`${prefix}sc\` to get started!`)
        }
    },
}