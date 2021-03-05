const commandBase = require('../command-base');
const puppeteer = require('puppeteer');
const Discord = require('discord.js');
const prefix = commandBase.getGuildPrefix();
let supportedLangs = {
    
    "python": "https://wandbox.org/nojs/cpython-head",
    "csharp": "https://wandbox.org/nojs/mono-head",
    "cplus": "https://wandbox.org/nojs/gcc-10.1.0",
    "jscript": "https://wandbox.org/nojs/nodejs-14.0.0",
    "java": "https://wandbox.org/nojs/openjdk-head",
    "bash": "https://wandbox.org/nojs/bash",
    "c":"https://wandbox.org/nojs/gcc-10.1.0-c",
    "cmake":"https://wandbox.org/nojs/cmake-head",
    "cscript":"https://wandbox.org/nojs/coffeescript-1.12.7",
    "crystal":"https://wandbox.org/nojs/crystal-0.24.1",
    "d":"https://wandbox.org/nojs/dmd-2.076.0",
    "elixir":"https://wandbox.org/nojs/elixir-1.7.1",
    "fsharp":"https://wandbox.org/nojs/fsharp-4.1.34",
    "go":"https://wandbox.org/nojs/go-1.14.2",
    "groovy":"https://wandbox.org/nojs/groovy-2.4.11",
    "haskell":"https://wandbox.org/nojs/ghc-8.4.2",
    "lazyk":"https://wandbox.org/nojs/lazyk",
    "lisp":"https://wandbox.org/nojs/clisp-2.49",
    "lua":"https://wandbox.org/nojs/lua-5.4.0",
    "nim":"https://wandbox.org/nojs/nim-1.4.0",
    "ocaml":"https://wandbox.org/nojs/ocaml-4.06.1",
    "ossl":"https://wandbox.org/nojs/openssl-1.1.0f",
    "php":"https://wandbox.org/nojs/php-7.3.3",
    "pascal":"https://wandbox.org/nojs/fpc-3.0.2",
    "perl":"https://wandbox.org/nojs/perl-5.32.0",
    "pony":"https://wandbox.org/nojs/pony-0.14.0",
    "r":"https://wandbox.org/nojs/r-3.5.1",
    "rill":"https://wandbox.org/nojs/rill-head",
    "ruby":"https://wandbox.org/nojs/ruby-head",
    "rust":"https://wandbox.org/nojs/rust-1.18.0",
    "sql":"https://wandbox.org/nojs/sqlite-3.19.3",
    "scala":"https://wandbox.org/nojs/scala-2.13.x",
    "swift":"https://wandbox.org/nojs/swift-5.0.1",
    "tscript":"https://wandbox.org/nojs/typescript-3.9.5",
    "vscript":"https://wandbox.org/nojs/vim-8.0.0671",
    
}
let browser;
let page;
let isCompiling = false; // This variable is for spam protection so the bot doesn't break when the compile command is called while another compile is active
// Startup headless chrome
const initCompiler = async () =>{
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
}
// Process message sent by user and turn it into code that can be send to the compiler
const userInputParser = (text) =>{
    let codeSentByUser = text.split(/```(\w*)/);
    let language = codeSentByUser[0].split("\n")[0].trim();
    codeSentByUser.shift();
    codeSentByUser.shift();
    codeSentByUser.pop();
    codeSentByUser.pop();
    return {codeSentByUser, language};

}
// Each language has it's own compiler link provided by wandbox.com. The links are in the supportedLang object.
// The following function compiles the input sent by the user using those links
const compile = async (selectLanguage, codeSentByUser, message) =>{
    // isCompiling is set to false when the main callback function finishes executing. At that point this function is available to be run again
    if(isCompiling == false){
        isCompiling = true;
        await page.goto(selectLanguage);
        await page.$eval('[name="code"]', (el, value) => el.value = value, codeSentByUser[0]);
        await page.click('[name="save"]');
        await page.click('[type="submit"]');
        const element = await page.$("body > div:nth-child(2) > pre");
        let compilerOutput = await page.evaluate(element => element.textContent, element);
        const secondaryCompilerOutput = await page.evaluate(() => {
            let el = document.querySelector("body > div:nth-child(3) > pre");
            return el ? el.innerText : false;
        })
        if(secondaryCompilerOutput)
        {
            compilerOutput += secondaryCompilerOutput;
        }
        await page.screenshot({path: 'debug1.png'});
        return compilerOutput.toLowerCase();
    }
    else{
        message.reply("Another compile is currently in progress, please a few moments before attempting to compile again!")
        return false;
    }
    
}
// Returns a bool depending on whether or not the language passed by the user is a supported language. Refer to the supportedLangs object for all supported languages
const isSupportedLanguage = (language) =>{
    console.log(language);
    return supportedLangs.hasOwnProperty(language);
}

// Start up browser in headless chrome
initCompiler();
module.exports = {
    commands: ['compile', 'cp'],
    minArgs: 1,
    maxArgs: null,
    expectedArgs: '[code]',
    permissions: [],
    requiredRoles: [],
    callback: async (message, arguments, text) =>{
        if(message.author.id != 816116634162167818){
            const {codeSentByUser, language} = userInputParser(text);
            console.log(language);
            if (codeSentByUser.length == 0)
            {
                message.reply("Please send a valid code block!");
                return;
            }
            console.log(codeSentByUser);
            if(isSupportedLanguage(language))
            {
                const compilerOutputEmbed = new Discord.MessageEmbed(); // Initialize embed object will be use to send the results of the compile to the user
                const selectedLanguage = supportedLangs[language];
                let compilerOutput = compile(selectedLanguage, codeSentByUser, message).then((compilerOutput) => {
                    if(compilerOutput){ // Check if the compilerOutput isn't false. It would be false if another compile was currently in progress (Refer to the compile() function)
                        if(compilerOutput.includes('error')){
                            compilerOutputEmbed
                            .setTitle("Compile failed!")
                            .setFooter(`Kali Compiler: Use \`${prefix}compile slang\` for list of supported languages`)
                            .setColor("#ff7e70")
                            .addFields({
                                name: "__Output__",
                                value: "```" + "\n" + compilerOutput + "\n" + "```",
                            }, {
                                name: "__Status__",
                                value: "Exited with status code 1"
                            });
                            isCompiling = false;
                            message.channel.send(compilerOutputEmbed);
                        }
                        else{
                            if(compilerOutput.length > 1000){ // Discord API prevents you from sending over 1024 characters in an embed. 1000 characters has been chosen as a padding in this scenario
                                console.log("Compiler output is greater 1024 characters");
                                compilerOutput = compilerOutput.substring(0,1000);
                                console.log(compilerOutput);
                            }
                            compilerOutputEmbed
                            .setTitle("Compile success!")
                            .setFooter(`Kali Compiler: Use \`${prefix}help compile langs\` for list of supported languages`)
                            .setColor("#70ff96")
                            .addFields({
                                name: "__Output__",
                                value: "```" + "\n" + compilerOutput + "\n" + "```",
                            }, {
                                name: "__Status__",
                                value: "Exited with status code 0!"
                            });
                            isCompiling = false;
                            message.channel.send(compilerOutputEmbed);
                            
                        }
                    }
                    });   
            }
            else{
                message.reply("That is not a supported language!");
            }
        }
    },
}
