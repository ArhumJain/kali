const Discord = require('discord.js');
const commandBase = require('../command-base');
// We require puppeteer as we are scraping using the Kuki AI and sending messages through the browser and then reading Kuki's message and sending it through discord
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
        // If the browser is already open, we do not want to open another one while it is still active!
        if(!chatStarted){
            message.channel.send(":gear: Starting chat...");
            // Start up the puppeteer browser
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
            });
            // Navigate to chat bot website
            await page.goto("https://www.pandorabots.com/mitsuku/");
            
            // Click on, "I am new here"
            await page.waitForSelector("#pb-message-container > div > div:nth-child(4) > div > button:nth-child(2)");
            await page.click("#pb-message-container > div > div:nth-child(4) > div > button:nth-child(2)");
            
            // Click on "Accept Terms and Conditions"
            await page.waitForSelector("#pb-message-container > div:nth-child(2) > div:nth-child(2) > div > button:nth-child(1)");
            await page.click("#pb-message-container > div:nth-child(2) > div:nth-child(2) > div > button:nth-child(1)");
            // Click  on "Just Chat"
            await page.waitForSelector("#pb-message-container > div:nth-child(4) > div:nth-child(2) > div > button:nth-child(2)");
            await page.click("#pb-message-container > div:nth-child(4) > div:nth-child(2) > div > button:nth-child(2)");
            
            await page.screenshot({path: "debug.png"});
            // await page.waitForSelector("#pb-widget-input-field");
            chatStarted = true;
            message.channel.send("Chat started!");
        }
        else {
            message.channel.send(`Chatbot engine already running! Use \`${prefix}tellbot\` or \`${prefix}tb\` to start talking with Kali!`)
        }
        
    },
}
// Public methods to obtain the reference of the browser started by puppeteer in this script as well as other key variables
module.exports.getBrowser = () =>{
    return browser;
}
module.exports.getPage = () =>{
    return page;
}
module.exports.getChatStarted = () =>{
    return chatStarted;
}
module.exports.setChatStarted = (bool) =>{
    chatStarted = bool;
}