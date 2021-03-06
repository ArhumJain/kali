# Kali Discord Bot
Added the stock command to retrieve data about a specific stock
- More Coming Soon!
---
## Usage
1. Create a discord bot application at the [discord developer portal](https://discord.com/developers/applications)
2. Copy discord bot secret key (token)
3. Get the bot's ID (You might need to turn on developer mode on Discord for this)
4. Get yourself a free API Key ID and Secret Key for the [Alpaca Trade API](https://alpaca.markets/). You can use [this](https://alpaca.markets/docs/get-started-with-alpaca/tutorial-videos/) for a step-by-step tutorial on getting started with Alpaca
5. You need to create a `.env` (Mandatory or the bot will not work) file in `src`
    - It should be structured like so:
        ```env
        TOKEN=1234567890
        BOTID=12345679087
        MONGOPASS=123456
        APCA_API_KEY_ID=AKFZXJH121U18SHHDRFO
        APCA_API_SECRET_KEY=pnq4YHlpMF3LhfLyOvmdfLmlz6BnASrTPQIASeiU
        PREFIX=!
        BULLETPOINTEMOJI=<:bulletpoint:821446907871494154>
        ```
        - Or you can set up environment variables in the same way if your hosting the bot on a server (I use [Heroku](https://www.heroku.com/)). Otherwise, if your service doesnt support built in environment variables or you are hosting on a personal machine, you **MUST** set up `.env`.
        - Note: BULLETPOINTEMOJI is an emoji for bullet points for embed formatting. It is a required environment variable and you have to provide the emoji in custom emoji format (I would make a separate server that contains the emoji and Kali bot so the bot can reference it.): 
          ```
          <:emoji_name:emoji_id>
          ```
          - In my case, I provided an diamond shaped emoji so embeds will display like this:
            <img src='./assets/embedsample.png' alt="embed sample" style="width:497px;height:377px;"></img>
          - You can find the same asset I used in the `assets` directory but you will have to upload it to a discord server yourself.
    - The bot uses MongoDB so you must create a MongoDB collection (with a user that uses password authentication) yourself and use the application string provided by MongoDB in `src/mongo.js`. Use this [video](https://www.youtube.com/watch?v=SyWdNBbzTIA&t) to find out how to set up a Mongo Data Base and get your connection string.
        - In `mongo.js` replace the string assigned to `mongoPath with your connection string
            ```
            const mongoPath = "mongodb+srv://<user>:<password>@cluster0.jx4hq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
            ```
4. You need to **npm install** the following packages for the bot to work. Incase I forget to include any packages here, you can check the package.json file for all the dependencies needed for this. (You may skip this step if running on a server like Heroku; all you need is the package.json to let the web service provider know what the project dependencies are)
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
    - ```
      npm install request
      ```
    - ```
      npm install @alpacahq/alpaca-trade-api
      ```