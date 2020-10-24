const discord = require("discord.js");
const fs = require("fs");
const fetch = require("node-fetch");
const moment = require("moment");

const botConfig = require("./data/botconfig.json");
console.log("Data file \"botconfig.json\" has been loaded.")

var swearAmount = require("./data/swearWords.json");
console.log("Data file \"swearAmount.json\" has been loaded.")

var swearWords = JSON.parse(fs.readFileSync("./data/swearWords.json"));
console.log("Data file \"swearWords.json\" has been loaded.")

const client = new discord.Client();
client.login(process.env.token);

client.commands = new discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);

    console.log(`Command file "${command.name}.js" has been loaded.`);

}

console.log(`${commandFiles.length} command files have been loaded.`);

var prefix = botConfig.prefix;
var embedColor = botConfig.embedColor;
var embedFooter = botConfig.embedFooter;

// Console log + set activity
client.on("ready", async () => {

    console.log(`${client.user.username} is ready.`);
    client.user.setActivity(",help | SkyblockSquad Bot", {type: "PLAYING"});

});

// Server detection
client.on("message", async message => {

    if(message.channel.type === "dm") return;
    if(message.author.bot) return;
    
    var check = message.content.toLowerCase();

    for (let i = 0; i < swearWords["swearWords"].length; i++) {
        if(check.includes(swearWords["swearWords"][i])) {
    
            message.delete();
            message.channel.send(`<@${message.author.id}>: **Please don't swear!**`).then(msg => msg.delete({timeout: 10000}));

            var userID = message.author.id;

            if(!(swearAmount[userID])) {
                swearAmount[userID] = {
                    amount: 0,
                    name: message.author.user
                }
            }

            swearAmount[userID].amount += 1;
            fs.writeFile("./data/swearAmount.json", JSON.stringify(swearAmount), err => {
                if(err) console.log(err);
            })

            return;

        }
    }

    if(!(message.member.hasPermission("ADMINISTRATOR"))) {
        if(!(message.channel.id === "703168301634945097")) {
            if(message.content.startsWith(`${prefix}`)) {

                message.delete();
                return message.channel.send(`<@${message.author.id}>: **Please use the <@703168301634945097> channel for bot commands!**`).then(msg => msg.delete({timeout: 10000}));

            }
        }
    }

    var args = message.content.split(" ");
    var command = args[0]
    args.shift();

    if(command === `${prefix}help`) {
        client.commands.get("help").execute(discord, message, prefix, embedColor, embedFooter, args);
    }

    if(command === `${prefix}info`) {
        client.commands.get("info").execute(discord, message, embedColor, embedFooter, client, args, moment);         
    }

    if(command === `${prefix}me`) {
        client.commands.get("me").execute(discord, message, embedColor, embedFooter, moment);
    }

    if(command === `${prefix}hack`) {
       client.commands.get("hack").execute(discord, message, embedColor, embedFooter, args);
    }

    if(command === `${prefix}is`) {
        client.commands.get("is").execute(message, args);
    }

    if(command === `${prefix}covid`) {
        client.commands.get("covid").execute(discord, message, embedColor, embedFooter, args, fetch);
    }

    if(command === `${prefix}rps`) {
        client.commands.get("rps").execute(message, args);
    }

    if(command === `${prefix}say`) {
        client.commands.get("say").execute(message, args);
    }

    if(command === `${prefix}ping`) {
        client.commands.get("ping").execute(message, args, client);
    }

    if(command === `${prefix}profile`) {
        client.commands.get("profile").execute(message, args, fetch);
    }

    if(command === `${prefix}hypixel`) {
        client.commands.get("hypixel").execute(message, args, discord, fetch, embedColor, embedFooter, moment)
    }

});