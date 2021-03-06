# Kali Discord Bot
Add a some utilities: Server Info, User Info, and ability to retrieve current server prefix!
- Polishing **stuff** :|
---
## Usage
1. Create a discord bot application at the [discord developer portal](https://discord.com/developers/applications)
2. Copy discord bot secret key (token)
3. You need to create a `.env` (Mandatory or the bot will not work) file in `src`
    - It should be structured like so:
        ```env
        TOKEN=1234567890
        MONGOPASS=123456
        PREFIX=!
        ```
        - Or you can set up environment variables in the same way if your hosting the bot on a server (I use [Heroku](https://www.heroku.com/)). Otherwise, if your service doesnt support built in environment variables or you are hosting on a personal machine, you **MUST** set up `.env`.
    - The bot uses MongoDB so you must create a MongoDB collection (with a user that uses password authentication) yourself and use the application string provided by MongoDB in `src/mongo.js`. Use this [video](https://www.youtube.com/watch?v=SyWdNBbzTIA&t) to find out how to set up a Mongo Data Base and get your connection string.
        - In `mongo.js` replace the string assigned to `mongoPath with your connection string
            ```
            const mongoPath = "mongodb+srv://<user>:<password>@cluster0.jx4hq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
            ```
4. You need to **npm install** the following packages for the bot to work (You may skip this step if running on a server like Heroku; all you need is the package.json to let the web service provider know what the project dependencies are)
    - ```
      npm install dotenv
      ```
    - ```
      npm install discord.js
      ```
    - ```
      npm install mongoose@5.11.15
      ```
    - ```
      npm install puppeteer
      ```