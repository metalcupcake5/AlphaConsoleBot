/**
 * ! Disable command
 */
const request = require('request');

module.exports = {
    title: "Disable",
    details: [
        {
            perms      : "Everyone",
            command    : "!Disable",
            description: "Disables your custom title"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (message.channel.id !== serverInfo.channels.setTitle) return;
        const keys = config.keys;
        const user = message.author;

        url = keys.SetTitleURL +
            "?DiscordID=" + user.id +
            "&key=" + keys.Password +
            "&title=X" +
            "&color=X";
        request({ method: "GET", url: url }, function(err, response, body) {
            if (err)
                return sendEmbed(user, "Their was an error updating your title. Please pm an admin this error: \n" + err)

            if (body) {
                if (body.toLowerCase().includes("done")) {
                    sendEmbed(user, "Your title has been disabled.");
                } else if (body.toLowerCase().includes("the user does not exist")) {
                    sendEmbed(user, "Hi, in order to use our custom title service you must authorize your discord account. \n" +
                    "Please click this link: http://alphaconsole.net/auth/index.php and login with your discord account.");
                }
            } else 
                sendEmbed(user, "There was an error. Please try again. If this problem continues please contact an admin.");
        })


    }
};