const Discord = require('discord.js');
var request = require('request');
const bot = new Discord.Client();

const config = require("./config.json");

function pluck(array) {
  return array.map(function(item) {
    return item["name"];
  });
}

function hasRole(mem, role) {
  return (pluck(mem.roles).includes(role));
}

function commandIs(str, msg) {
  return msg.content.toLowerCase().startsWith("!" + str)
}

bot.on('ready', () => {
  console.log('Bot Online!');
});

bot.on("guildMemberAdd", member => {
  let guild = member.guild;
  message.guild.channels.find("name", "289247179921424384").sendMessage(`Welcome, ${member.user} to the California VEX Teams Discord! `);
});

var meme = [
  'Tips more than 21S',
  '8686868686868686',
  'worse than the 60X programming skill score XD',
  '62? more like 60X XD',
  'GET GUD M8',
  'Coryz typing skill level',
  'Turet bot',
  'Turet bot v2? :wink:',
  'Ryans building skills',
  'Tries to fix auton. Leavs tape on line sensor...'
];

bot.on('message', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);
  console.log(command);

  let args = message.content.split(" ").slice(1);

  if (command === "help") {
   message.channel.sendMessage(
      "\n**!meme** | Displays:ok_hand: :fire: meme" +
      "\n**!ping** | pong" +
      "\n**!say <message>** | I'll do whatever you say :wink:" +
      "\n**!kick** | Bye bye :cry:" +
      "\n**!purge <input>** | Clears messages from chat" +
      "\n**!roll** | Roll the dice!" +
      "\n**!info <input team #>** | Gets info on a team" +
      "\n**!skills <input team #>** | Gets skills info" +
      "\n**!awards <input team #>** | Gets award info");
  }

  if (command === "heil") {
    message.reply("you now accept Cory as your new Supreme Overlord. Bow Down!");
  }

  if (command === "say") {
    if (hasRole(message.member, "Admin") || (message.member, "Mods")) {
      var placeHolder = args.join("");
      message.channel.sendMessage(placeHolder);
    } else {
      message.channel.sendMessage("You can't tell me what to do :angry:");
    }
  }

  if (command === "meme") {
    message.channel.sendMessagey(meme[Math.floor((Math.random() * meme.length))]);
  }

  if (command === "roll") {
    var rolled = Math.floor((Math.random() * 100));
    message.channel.sendMessage(':game_die: ' + rolled);
  }

  if (command === "awards") {
    request('http://api.vexdb.io/v1/get_awards?team=' + args + '&season=In The Zone',
      function(error, response, body) {
        body = JSON.parse(body);

        if (body.status === 1) {
          if (body.size > 0) {
            var string = body.result[0].team + '\n' + body.size + ' award' + (body.size == 1 ? '' : 's') + ':';
            var awards = {};

            for (var award of body.result) {
              awards[award.name] = (awards[award.name] || 0) + 1;
            }
            for (var award in awards) {
              string += '\n🏅' + awards[award] + 'x ' + award;
            }
            message.reply('', {
              embed: {
                color: 3447003,
                description: string
              }
            });
          } else {
            request('http://api.vexdb.io/v1/get_teams?season=current&team=' + args,
              function(error, response, body) {
                body = JSON.parse(body);

                if (body.size > 0) {
                  //								if (body.is_registered === "1") {
                  message.reply('', {
                    embed: {
                      color: 3447003,
                      description: body.result[0].number + ' hasn\'t won any awards yet this season.'
                    }
                  });
                  //								} else {
                  //									bot.reply(msg, body.result[0].number + ' hasn\'t been registered yet for this season.')
                  //								}
                } else {
                  message.channel.sendMessage('', {
                    embed: {
                      color: 3447003,
                      description: 'Sorry that team doesn\'t exist.',
                      //image: {
                        //url: 'https://media.giphy.com/media/Pn1gZzAY38kbm/giphy.gif'
                      //}
                    }
                  });
                }
              });
          }
        } else {
          bot.reply(msg, 'Sorry, VexDB did not respond.');
          console.log('VexDB Server Error: ' + body.error_code);
          console.log(body.error_text);
        }
      });
  }

  if (command === "skills") {
    request('http://api.vexdb.io/v1/get_skills?season_rank=true&season=current&team=' + args,
      function(error, response, body) {
        body = JSON.parse(body);

        if (body.status == 1) {
          if (body.size > 0) {
            var string = body.result[0].team + '\n';
            var driver, programming, combined;

            for (var i = 0; i < 3; i++) {
              var result = body.result[i]

              switch (parseInt(result.type)) {
                case 0:
                  driver = result;
                  break;
                case 1:
                  programming = result;
                  break;
                case 2:
                  combined = result;
                  break;
              }
            }
            if (driver) {
              string += 'Driver: ' + driver.score + ' (#' + driver.season_rank + ' in the world)\n';
            }
            if (programming) {
              string += 'Programming: ' + programming.score + ' (#' + programming.season_rank + ' in the world)\n';
            }
            if (combined) {
              string += 'Combined: ' + combined.score + ' (#' + combined.season_rank + ' in the world)\n';
            }
            message.channel.sendMessage('', {
              embed: {
                color: 3447003,
                description: string
              }
            });
          } else {
            request('http://api.vexdb.io/v1/get_teams?season=current&team=' + args,
              function(error, response, body) {
                body = JSON.parse(body);

                if (body.size > 0) {
                  //								if (body.is_registered === "1") {
                  message.channel.sendMessage('', {
                    embed: {
                      color: 3447003,
                      description: body.result[0].number + ' hasn\'t competed yet this season.'
                    }
                  });

                } else {
                  message.channel.sendMessage('', {
                    embed: {
                      color: 3447003,
                      description: 'Sorry that team doesn\'t exist.',
                      //image: {
                        //url: 'https://media.giphy.com/media/Pn1gZzAY38kbm/giphy.gif'
                      //}
                    }
                  });
                }
              });
          }
        } else {
          message.channel.sendMessage('Sorry, VexDB did not respond.');
          console.log('VexDB Server Error: ' + body.error_code);
          console.log(body.error_text);
        };
      });
  }

  if (command === "info") {
    request('http://api.vexdb.io/v1/get_teams?team=' + args,
      function(error, response, body) {
        body = JSON.parse(body);

        if (body.status == 1) {
          if (body.size > 0) {
            var team = body.result[0];
            var string = team.number;

            if (team.robot_name) {
              string += ', ' + team.robot_name;
            }
            string += '\n' + team.team_name;

            if (team.organisation) {
              string += ', ' + team.organisation;
            }
            string += '\n' + team.city;

            if (team.region !== 'N/A' && team.region !== 'Not Applicable or Not Listed') {
              string += ', ' + team.region;
            }
            if (team.country) {
              string += ', ' + team.country;
            }
            message.channel.sendMessage('', {
              embed: {
                color: 3447003,
                description: string,
                //image: {
                  //url: 'https://maps.googleapis.com/maps/api/staticmap?center=' + team.city +','+team.region+',&zoom=13&size=600x300&maptype=roadmap&key=AIzaSyAGnvKpE4XzJuqNd_9HYa1idtVIyXw-D-M'
                //}
              }
            });
          } else {
            message.channel.sendMessage('', {
              embed: {
                color: 3447003,
                description: 'Sorry that team doesn\'t exist.',
                image: {
                  url: 'https://media.giphy.com/media/Pn1gZzAY38kbm/giphy.gif'
                }
              }
            });
          }
        } else {
          message.channel.sendMessage('Sorry, VexDB did not respond.');
          console.log('VexDB Server Error: ' + body.error_code);
          console.log(body.error_text);
        }
      });
  }

  if (command === "kick") {
    let modRole = message.guild.roles.find("name", "Admin");
    if (!hasRole(message.member, "Owner")) {
      return message.reply("If you do that again I'll kick you :angry:");
    }
    if (message.mentions.users.size === 0) {
      return message.reply("Mention a user to kick");
    }
    let kickMember = message.guild.member(message.mentions.users.first());
    if (!kickMember) {
      return message.reply("That isn't a user...");
    }
    if (!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
      return message.reply("I do not have the permissions to do this.");
    }
    kickMember.kick().then(member => {
      message.reply(`${member.user.username} was kicked`);
    }).catch(e => {
      console.error(e);
    });
  }

  if (command === "ping") {
    message.reply('pong');
  }
  if (command === "purge") {
    if (hasRole(message.member, "Owner")) {
      if (args.length >= 3) {
        message.reply("You defined too many arguments. Usage:");
      } else {
        var msg;
        if (args === 1) {
          msg = 2;
        } else {
          msg = parseInt(args) + 1;
        }
        message.channel.fetchMessages({
          limit: msg
        }).then(messages => message.channel.bulkDelete(messages)).catch(console.error);
      }
    } else {
      message.reply("You must be an [Admin] to use this command.");
    }
  }
});




bot.login(config.token);
