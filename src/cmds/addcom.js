/**
 * ! Add command command
 * 
 * ? Simply adds a custom command.
 */
const Discord = require('discord.js');

module.exports = {
    title: "AddCommand",
    details: [
        {
            perms      : "Staff",
            command    : "!addcom <command> <response>",
            description: "Adds a custom command to the list."
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {
        if (!message.member.isStaff) return;
        if (args.length < 4) return sendEmbed(message.channel, "You did not include the command & the response.")

        let command = args[1].startsWith('!') ? args[1].substring(1,0) : args[1];
        let language = args[2];
        let response = "";
        for (i = 3; i < args.length; i++) {
            if (args[i] == "@everyone") {
                response += "`@everyone` ";
            } else if (args[i] == "@here") {
                response += "`@here` ";
            }/* else if (message.mentions.roles.cache.has(args[i].replace(/[^0-9]/g, ""))) {
                response +="**" + message.mentions.roles.get(args[i].replace(/[^0-9]/g, "")).name + "** ";
            } else if (message.mentions.users.has(args[i].replace(/[^0-9]/g, ""))) {
                response += "**" + message.mentions.users.get(args[i].replace(/[^0-9]/g, "")).tag + "** ";
            } */else {
                response += args[i] + " ";
            }
        }

        sql.query("Select * from Commands where Command = ? and Language = ?", [ command, language ], (err, res) => {
            if (err) {
                let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
            }
            if (res.length !== 0) return sendEmbed(message.channel, `The command "${command}" already exists with that language!`);

            sql.query("Insert into Commands(Command, Response, Language) Values(?, ?, ?)", [ command, response, language ]);
            sendEmbed(message.channel, "Custom command added!");

            const embedlog = new Discord.RichEmbed()
              .setColor([255, 255, 0])
              .setAuthor("Custom Command Added", client.user.avatarURL)
              .addField("Command", command)
              .addField("Response", response)
              .addField("language", language)
              .addField("Added by", `**${message.author.tag}** (${message.member})`)
              .setThumbnail(message.author.avatarURL)
              .setTimestamp();
            message.channel.send(embedlog);
        })
    }
}