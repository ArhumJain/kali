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
            await page.type('#pb-widget-input-field', messageToSendToBot);
            await page.keyboard.press('Enter')
            await page.screenshot({path: 'kalichat.png'});
            const listOfBotResponses = await page.$$eval('.pb-message > div > div', responses => responses.map(response => response.innerText));
            message.channel.send(listOfBotResponses[listOfBotResponses.length - 1]);
        }
        else{
            message.channel.send(`A chat session has not been started. Use \`${prefix}startchat\` or \`${prefix}sc\` to get started!`)
        }
    },
}