var { Client, GatewayIntentBits, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
var { joinVoiceChannel, createAudioResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
var ytdl = require('ytdl-core');

var client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
var token = ""

var commandList = [
    {
        name: 'play',
        description: 'Play music from Youtube',
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'url',
                description: 'Youtube URL',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    }
];


client.once('ready', () => {
    console.log('fastestmusic is now online!');
    client.application.commands.set(commandList);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    var voiceChannel = interaction.member.voice.channel;
    try {
        var connection = await joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });
        var stream = ytdl(interaction.options.getString('url'), {
            filter: 'audioonly',
            fmt: 'mp3',
            highWaterMark: 1 << 30,
            liveBuffer: 20000,
            dlChunkSize: 4096,
            bitrate: 384,
            quality: 'highestaudio'
        });
        var player = createAudioPlayer();
        var resource = createAudioResource(stream);
        await player.play(resource);
        connection.subscribe(player)
    } catch (err) {
        console.log(err)
    }
});

client.login(token);