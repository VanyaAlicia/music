const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "remove",
  description: `Hapus lagu dari antrean`,
  usage: "[number]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["rm"],

  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.players.get(message.guild.id);
    const song = player.queue.slice(args[0] - 1, 1);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Tidak ada yang diputar saat ini...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Anda harus berada di voice room untuk menggunakan perintah ini!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        "❌ | **Anda harus berada di Voice room yang sama dengan saya untuk menggunakan perintah ini!**"
      );

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return message.channel.send("There is nothing in the queue to remove");
    let rm = new MessageEmbed()
      .setDescription(
        `✅ **|** Removed track **\`${Number(args[0])}\`** from the queue!`
      )
      .setColor("GREEN");
    if (isNaN(args[0]))
      rm.setDescription(
        `**Usage - **${client.botconfig.prefix}\`remove [track]\``
      );
    if (args[0] > player.queue.length)
      rm.setDescription(`The queue has only ${player.queue.length} songs!`);
    await message.channel.send(rm);
    player.queue.remove(Number(args[0]) - 1);
  },

  SlashCommand: {
    options: [
      {
        name: "track",
        value: "[track]",
        type: 4,
        required: true,
        description: "Remove a song from the queue",
      },
    ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      let player = await client.Manager.get(interaction.guild_id);
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      const song = player.queue.slice(args[0] - 1, 1);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Tidak ada yang diputar saat ini...**"
        );
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **Anda harus berada di voice room untuk menggunakan perintah ini!.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          "❌ | **Anda harus berada di Voice room yang sama dengan saya untuk menggunakan perintah ini!**"
        );

      if (!player.queue || !player.queue.length || player.queue.length === 0)
        return client.sendTime("❌ | **Tidak ada yang diputar saat ini...**");
      let rm = new MessageEmbed()
        .setDescription(
          `✅ | **Removed track** \`${Number(args[0])}\` from the queue!`
        )
        .setColor("GREEN");
      if (isNaN(args[0]))
        rm.setDescription(`**Usage:** \`${GuildDB.prefix}remove [track]\``);
      if (args[0] > player.queue.length)
        rm.setDescription(`The queue has only ${player.queue.length} songs!`);
      await interaction.send(rm);
      player.queue.remove(Number(args[0]) - 1);
    },
  },
};
