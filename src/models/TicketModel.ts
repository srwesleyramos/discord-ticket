import State from "../enums/State";

class TicketModel {

    readonly ticket_id: string;
    readonly author_id: string;
    readonly guild_id: string;

    sector_id: string;
    state: State;
    thread_id: string | null;

    constructor(ticket_id: string, author_id: string, guild_id: string, sector_id: string, state: State, thread_id: string | null) {
        this.ticket_id = ticket_id;
        this.author_id = author_id;
        this.guild_id = guild_id;
        this.sector_id = sector_id;
        this.state = state;
        this.thread_id = thread_id;
    }

    // archive()
    // create()
    // transfer()
    // close()

// async init(channels: ChannelManager) {
    //     if (!this.thread_id) {
    //         this.state = State.UNKNOWN;
    //         return;
    //     }
    //
    //     try {
    //         const generic = await channels.fetch(this.thread_id, {cache: true});
    //
    //         if (generic) {
    //             const channel = generic as PrivateThreadChannel;
    //
    //             this.state = channel.archived ? State.CLOSED : State.OPEN;
    //         } else {
    //             this.state = State.UNKNOWN;
    //         }
    //     } catch (error) {
    //         this.state = State.UNKNOWN;
    //     }
    // }
    //
    // /*                                                  *
    //  *               GERENCIANDO O TICKET               *
    //  *                                                  */
    //
    // async open(sector: SectorModel, parent: TextChannel, reason: string) {
    //     const thread = await parent.threads.create({
    //         autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
    //         name: reason,
    //         invitable: false,
    //         type: ChannelType.PrivateThread
    //     });
    //
    //     await thread.members.add(this.user_id);
    //
    //     this.state = State.OPEN;
    //     this.sector_id = sector.id;
    //     this.thread_id = thread.id;
    //
    //     await this.welcomeMessage(sector, thread.client.channels);
    //     await this.insertMembers(sector, thread.client.channels);
    // }
    //
    // async close(channels: ChannelManager, reason: string) {
    //     if (!this.sector_id || !this.thread_id) return;
    //
    //     const generic = await channels.fetch(this.thread_id, {cache: true});
    //     const channel = generic as PrivateThreadChannel;
    //     const sector = Sectors.getSectorById(this.sector_id);
    //
    //     if (sector) {
    //         await this.removeMembers(sector, channels);
    //         await this.solvedMessage(sector, channels, reason);
    //     }
    //
    //     await channel.setLocked(true);
    //     await channel.setArchived(true);
    //
    //     this.state = State.CLOSED;
    // }
    //
    // async transfer(sector: SectorModel, channels: ChannelManager, reason: string) {
    //     if (!this.sector_id || !this.thread_id) return;
    //
    //     const current = Sectors.getSectorById(this.sector_id);
    //
    //     if (current) {
    //         await this.removeMembers(current, channels);
    //     }
    //
    //     await this.transferMessage(sector, channels, reason);
    //     await this.insertMembers(sector, channels);
    //
    //     this.sector_id = sector.id;
    // }
    //
    // /*                                                  *
    //  *            ABRINDO O TICKET PRA STAFF            *
    //  *                                                  */
    //
    // async insertMembers(sector: SectorModel, channels: ChannelManager) {
    //     if (!this.sector_id || !this.thread_id) return;
    //
    //     const generic = await channels.fetch(this.thread_id, {cache: true});
    //     const channel = generic as PrivateThreadChannel;
    //     const members = await sector.get(channel.guild);
    //
    //     for (const member of Array.from(members.values())) {
    //         await channel.members.add(member);
    //     }
    // }
    //
    // async removeMembers(sector: SectorModel, channels: ChannelManager) {
    //     if (!this.sector_id || !this.thread_id) return;
    //
    //     const generic = await channels.fetch(this.thread_id, {cache: true});
    //     const channel = generic as PrivateThreadChannel;
    //     const members = await sector.get(channel.guild);
    //
    //     for (const member of Array.from(members.values())) {
    //         if (member.id !== this.user_id) {
    //             await channel.members.remove(member.id);
    //         }
    //     }
    // }
    //
    // /*                                                  *
    //  *             INTERAGINDO COM O TICKET             *
    //  *                                                  */
    //
    // async solvedMessage(sector: SectorModel, channels: ChannelManager, reason: string) {
    //     if (!this.sector_id || !this.thread_id) return;
    //
    //     const generic = await channels.fetch(this.thread_id, {cache: true});
    //     const channel = generic as TextChannel;
    //
    //     await channel.send({
    //         embeds: [
    //             new EmbedBuilder()
    //                 .setAuthor({
    //                     name: 'Atendimento encerrado',
    //                     iconURL: channel.client.user.avatarURL() ?? channel.client.user.defaultAvatarURL
    //                 })
    //                 .setDescription(
    //                     'O atendimento foi encerrado e arquivado nas thread.\n' +
    //                     '\n' +
    //                     'Observação:\n' +
    //                     reason
    //                 )
    //         ]
    //     });
    // }
    //
    // async transferMessage(sector: SectorModel, channels: ChannelManager, reason: string) {
    //     if (!this.sector_id || !this.thread_id) return;
    //
    //     const generic = await channels.fetch(this.thread_id, {cache: true});
    //     const channel = generic as TextChannel;
    //     const latest = Sectors.getSectorById(this.sector_id);
    //
    //     await channel.send({
    //         embeds: [
    //             new EmbedBuilder()
    //                 .setAuthor({
    //                     name: 'Transferência de setor',
    //                     iconURL: channel.client.user.avatarURL() ?? channel.client.user.defaultAvatarURL
    //                 })
    //                 .setDescription(
    //                     'O atendimento foi transferido para outro setor.\n' +
    //                     '\n' +
    //                     'Detalhes:\n' +
    //                     `<:right_arrow:975008491968290866> Setor original: <@&${latest?.role_id ?? this.sector_id}>\n` +
    //                     `<:right_arrow:975008491968290866> Setor atribuído: <@&${sector.role_id}>\n` +
    //                     '\n' +
    //                     'Motivo:\n' +
    //                     reason
    //                 )
    //         ]
    //     });
    // }
    //
    // async welcomeMessage(sector: SectorModel, channels: ChannelManager) {
    //     if (!this.sector_id || !this.thread_id) return;
    //
    //     const generic = await channels.fetch(this.thread_id, {cache: true});
    //     const channel = generic as TextChannel;
    //
    //     await channel.send({
    //         components: [
    //             new ActionRowBuilder<ButtonBuilder>()
    //                 .addComponents(
    //                     [
    //                         new ButtonBuilder()
    //                             .setCustomId("transfer-ticket")
    //                             .setLabel("Trocar setor")
    //                             .setStyle(ButtonStyle.Primary),
    //                         new ButtonBuilder()
    //                             .setCustomId("close-ticket")
    //                             .setLabel("Fechar atendimento")
    //                             .setStyle(ButtonStyle.Danger)
    //                     ] as any
    //                 )
    //         ],
    //         embeds: [
    //             new EmbedBuilder()
    //                 .setAuthor({
    //                     name: 'Informações sobre seu atendimento',
    //                     iconURL: channel.client.user.avatarURL() ?? channel.client.user.defaultAvatarURL
    //                 })
    //                 .setDescription(
    //                     'Olá! Bem-vindo ao nosso sistema de atendimento ao cliente!\n' +
    //                     '\n' +
    //                     'Informações:\n' +
    //                     `<:right_arrow:975008491968290866> Atribuíção: <@&${sector?.role_id}>\n` +
    //                     `<:right_arrow:975008491968290866> Criado por: <@${this.user_id}>\n` +
    //                     '\n' +
    //                     'Horário comercial:\n' +
    //                     '<:right_arrow:975008491968290866> segunda a sexta: 08:00 - 18:00\n' +
    //                     '<:right_arrow:975008491968290866> sábado e domingo: 08:00 - 13:00'
    //                 )
    //         ]
    //     });
    // }
}

export default TicketModel;