module.exports = {
    name: 'hack',
    description: '*Hack the server! (You won\'t get banned lol)*',
    category: 'Fun & Games',
    execute(client, message, args) {

        const discord = require("discord.js");
        const botConfig = require("../data/botconfig.json");

        var embedColor = botConfig.embedColor;
        var embedFooter = botConfig.embedFooter;

        if (message.channel.type == "dm") {
            message.channel.send('**Error:** This command can not be used in DM!');
            return;
        }

        if (args.length == 1 && args[0].toLowerCase() === "hypixel") {

            message.channel.send("I'm currently hacking HypixeL... Please wait...")

            var PasswordOptions = ["hypixel_skyblock_is_cool", "mineplex_smells", "SuperSecretPassword123", "hypickle", "technoblade_potatoboy", "stonks", "What_is_a_password?", "kronks",
                "choncks", "stonks", "honks"]
            var PasswordInteger = Math.floor(Math.random() * PasswordOptions.length);
            var PasswordOption = PasswordOptions[PasswordInteger];

            var botEmbed = new discord.MessageEmbed()
                .setTitle("HACKING HYPIXEL...")
                .setDescription(`Here are Hypixel's e-mail and password:`)
                .setColor(embedColor)
                .setFooter(embedFooter)
                .setTimestamp()
                .addFields(
                    { name: "E-mail:", value: "creators@hypixel.net" },
                    { name: "Password: ", value: `${PasswordOption}` }
                );

            message.channel.send(botEmbed);
            return;

        }

        message.react('👍').then(() => message.react('👎'));
        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        message.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '👍') {
                    message.channel.send('You wish.');
                    message.reactions.removeAll();
                } else {
                    message.channel.send('Nice! You are actually not a hacker!');
                    message.reactions.removeAll();
                }
            })
            .catch(collected => {
                message.channel.send('**Error:** No reaction within 30 seconds!');
                message.reactions.removeAll();
            });

    },
};