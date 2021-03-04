const Discord = require('discord.js');
const commandBase = require('../command-base');
const puppeteer = require('puppeteer');

let browser = null;
let page = null;
let chatStarted = false;
const prefix = commandBase.getGuildPrefix();
module.exports = {
    commands: ['startchat', 'sc'],
    minArgs: 0,
    permissions: [],
    requiredRoles: [],
    callback: async (message, arguments, text) =>{
        if(!chatStarted){
            message.channel.send(":gear: Starting chat...");
            browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ]
            });
            page = await browser.newPage();
            await page.setViewport({
                width: 1280,
                height: 720
            })
            // await page.goto('https://www.pandorabots.com/mitsuku/');
            // await page.click("#pb-message-container > div > div:nth-child(4) > div > button:nth-child(2)");
            // await page.waitForSelector("#pb-message-container > div:nth-child(2) > div:nth-child(2) > div > button:nth-child(1)");
            // await page.click("#pb-message-container > div:nth-child(2) > div:nth-child(2) > div > button:nth-child(1)");
            // await page.waitForSelector("#pb-message-container > div:nth-child(4) > div:nth-child(2) > div > button:nth-child(2)");
            // await page.click("#pb-message-container > div:nth-child(4) > div:nth-child(2) > div > button:nth-child(2)");
            // await page.waitForXPath("//*[@id='main-input']/input");
            await page.goto("https://www.pandorabots.com/mitsuku/");
            await page.click("#pb-widget > div > div > button");
            await page.waitForSelector("#pb-widget-input-field");
            chatStarted = true;
            message.channel.send("Chat started!");
        }
        else {
            message.channel.send(`Chatbot engine already running! Use \`${prefix}tellbot\` or \`${prefix}tb\` to start talking with Kali!`)
        }
        
    },
}
module.exports.getBrowser = () =>{
    return browser;
}
module.exports.getPage = () =>{
    return page;
}
module.exports.getChatStarted = () =>{
    return chatStarted;
}