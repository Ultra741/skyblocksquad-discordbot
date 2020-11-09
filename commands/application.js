module.exports = {
    name: 'application',
    description: 'application',
    execute(message, discord) {
    
        var categoryID = "774903762447630367";

        var ticketUser = message.guild.member(message.mentions.users.first());

        if (message.channel.parentID !== categoryID) return message.channel.send("**Error:** You must be in an application ticket to do this!");

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("**Error:** You don't have permission to do this!");

        if (!ticketUser) return message.channel.send("**Error:** Couldn't find that user!");

        var choiceEmbed = new discord.MessageEmbed()
            .setTitle("MANAGE APPLICATION")
            .setColor("00BFFF")
            .addField("Accepted:", "☑️", false)
            .addField("Rejected:", "❌", false);

         var reasonEmbed = new discord.MessageEmbed()
            .setTitle("MANAGE APPLICATION")
            .setColor("00BFFF")
            .addField("Reason:", "Please enter a reason.", false)

        var dmEnabled = new discord.MessageEmbed()
            .setTitle("SUCCES!")
            .setColor("00BFFF")
            .setDescription(`I have succesfully sent a DM to ${ticketUser}!`)

        var dmDisabled = new discord.MessageEmbed()
            .setTitle("ERROR!")
            .setColor("00BFFF")
            .setDescription(`Couldn't send a DM to ${ticketUser} because they have private messages disabled!`)

        const filter = m => m.content;

        message.channel.send(choiceEmbed).then(async msg => {

            var emoji = await promptMessage(msg, message.author, 300, ["☑️", "❌"]);

            if(emoji === "☑️") {
                
                message.channel.send(reasonEmbed).then(msg => msg.delete({ timeout: 30000}));

                message.channel.awaitMessages(filter, {max: 1, time: 10000}).then(collected => {

                    var reason = collected.first();
                    
                    var result = new discord.MessageEmbed()
                        .setTitle("ACCEPTED")
                        .setColor("00BFFF")
                        .addField("User:", `${ticketUser}`, false)
                        .addField("Reason:", `${reason}`, false)
                        .addField("Accepted by:", `<@${message.author.id}>`, false)

                    message.channel.bulkDelete(3);
                    message.channel.send(result);

                    var dm = new discord.MessageEmbed()
                        .setTitle("ACCEPTED")
                        .setColor("00BFFF")
                        .setDescription("Your Helper application has been accepted!")
                        .addField("Accepted by:", `<@${message.author.id}>`, false)
                        .addField("Reason:", `${reason}`, false)

                    message.member.send(dm).then(() => {
                        message.channel.send(dmEnabled);
                    }).catch(() => {
                        message.channel.send(dmDisabled);
                    })

                })

            } else if(emoji === "❌") {

                message.channel.send(reasonEmbed).then(msg => msg.delete({ timeout: 30000}));

                message.channel.awaitMessages(filter, {max: 1, time: 10000}).then(collected => {

                var reason = collected.first();
                    
                var result = new discord.MessageEmbed()
                    .setTitle("REJECTED")
                    .setColor("00BFFF")
                    .addField("User:", `${ticketUser}`, false)
                    .addField("Reason:", `${reason}`, false)
                    .addField("Rejected by:", `<@${message.author.id}>`, false)

                message.channel.bulkDelete(3);
                message.channel.send(result);

                var dm = new discord.MessageEmbed()
                    .setTitle("REJECTED")
                    .setColor("00BFFF")
                    .setDescription("Your Helper application has been rejected!")
                    .addField("Rejected by:", `<@${message.author.id}>`, false)
                    .addField("Reason:", `${reason}`, false)

                message.member.send(dm).then(() => {
                    message.channel.send(dmEnabled)
                }).catch(() => {
                    message.channel.send(dmDisabled);
                })

                })

            }

        })

        async function promptMessage(message, author, time, reactions) {

            time *= 1000;

            for (const reaction of reactions) {
                await message.react(reaction);
            }

            const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

            return message.awaitReactions(filter, { max: 1, time: time}).then(collected => collected.first() && collected.first().emoji.name);

        }

    },
};