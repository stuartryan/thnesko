'use strict';
const bot = require('./../../index.js');
const log = require('./../../logger.js');
const queue = require('./join.js');

bot.on('voiceChannelLeave', (member, oldChannel) => {
    if (oldChannel.voiceMembers.size === 1 && member.user.id !== bot.user.id) bot.leaveVoiceChannel(oldChannel.id);
});

bot.registerCommand('leave', (msg, args) => {
    if (msg.channel.guild.members.get(bot.user.id).voiceState.channelID === null) return `**${msg.author.username}**, I'm not connected to a voice channel.`;
    if (msg.member.voiceState.channelID === null || msg.member.voiceState.channelID !== msg.channel.guild.members.get(bot.user.id).voiceState.channelID) return `**${msg.author.username}**, you must be in the same channel as me to use this command.`;
    bot.createMessage(msg.channel.id, `Left ${msg.channel.guild.channels.get(msg.member.voiceState.channelID).name} for ${msg.author.username}`).then((msg) => {
        delete queue[bot.voiceConnections.get(msg.channel.guild.id).id];
        bot.leaveVoiceChannel(msg.member.voiceState.channelID);
    }).catch(error => log.errC(error));
}, {
    caseInsensitive: true,
    deleteCommand: true,
    description: 'remove the bot from the channel.',
    fullDescription: 'make the bot leave a voice channel.',
    serverOnly: true,
    requirements: {
        permissions: {
            'voiceConnect': true,
        }
    },
    cooldown: 5000
});