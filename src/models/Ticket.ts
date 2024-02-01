import Sector from "./Sector";
import Sectors from "../controllers/SectorController";

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelManager,
    ChannelType,
    EmbedBuilder,
    PrivateThreadChannel,
    TextChannel
} from "discord.js";

import {v4 as uuid} from "uuid";

export default class Ticket {

    readonly id: string;
    readonly user_id: string;

    sector_id: string | null;
    thread_id: string | null;

    constructor(id: string | null, user_id: string, sector_id?: string, thread_id?: string) {
        this.id = id ?? uuid();
        this.sector_id = sector_id ?? null;
        this.thread_id = thread_id ?? null;
        this.user_id = user_id;
    }

    async open(sector: Sector, reason: string, parent: TextChannel) {
        const thread = await parent.threads.create({
            name: reason,
            invitable: false,
            type: ChannelType.PrivateThread
        });

        await thread.members.add(this.user_id);

        this.sector_id = sector.id;
        this.thread_id = thread.id;

        await this.welcomeMessage(sector, thread.client.channels);
        await this.createMembers(sector, thread.client.channels);
    }

    async close(channels: ChannelManager, reason: string) {
        if (!this.sector_id || !this.thread_id) return;

        const generic = await channels.fetch(this.thread_id, {cache: true});
        const channel = generic as PrivateThreadChannel;
        const sector = Sectors.getSectorById(this.sector_id);

        if (sector) {
            await this.removeMembers(sector, channels);
            await this.finishedMessage(sector, channels, reason);
        }

        await channel.setLocked(true);
        await channel.setArchived(true);
    }

    async createMembers(sector: Sector, channels: ChannelManager) {
        if (!this.sector_id || !this.thread_id) return;

        const generic = await channels.fetch(this.thread_id, {cache: true});
        const channel = generic as PrivateThreadChannel;
        const members = await sector.get(channel.guild);

        for (const member of Array.from(members.values())) {
            if (member.id !== this.user_id) {
                await channel.members.add(member);
            }
        }
    }

    async removeMembers(sector: Sector, channels: ChannelManager) {
        if (!this.sector_id || !this.thread_id) return;

        const generic = await channels.fetch(this.thread_id, {cache: true});
        const channel = generic as PrivateThreadChannel;
        const members = await sector.get(channel.guild);

        for (const member of Array.from(members.values())) {
            if (member.id !== this.user_id) {
                await channel.members.remove(member.id);
            }
        }
    }

    async welcomeMessage(sector: Sector, channels: ChannelManager) {
        if (!this.sector_id || !this.thread_id) return;

        const generic = await channels.fetch(this.thread_id, {cache: true});
        const channel = generic as TextChannel;

        await channel.send({
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("change-sector")
                                .setLabel("Trocar setor")
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId("close-ticket")
                                .setLabel("Fechar atendimento")
                                .setStyle(ButtonStyle.Danger)
                        ] as any
                    )
            ],
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: 'Informações sobre seu atendimento',
                        iconURL: channel.client.user.avatarURL() ?? channel.client.user.defaultAvatarURL
                    })
                    .setDescription(
                        'Olá! Bem-vindo ao nosso sistema de atendimento ao cliente!\n' +
                        '\n' +
                        'Informações:\n' +
                        `<:right_arrow:975008491968290866> Atribuíção: <@&${this.sector_id}>\n` +
                        `<:right_arrow:975008491968290866> Criado por: <@${this.user_id}>\n` +
                        '\n' +
                        'Horário comercial:\n' +
                        '<:right_arrow:975008491968290866> segunda a sexta: 08:00 - 18:00\n' +
                        '<:right_arrow:975008491968290866> sábado e domingo: 08:00 - 13:00'
                    )
            ]
        });
    }

    async finishedMessage(sector: Sector, channels: ChannelManager, reason: string) {
        if (!this.sector_id || !this.thread_id) return;

        const generic = await channels.fetch(this.thread_id, {cache: true});
        const channel = generic as TextChannel;

        await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: 'Atendimento encerrado',
                        iconURL: channel.client.user.avatarURL() ?? channel.client.user.defaultAvatarURL
                    })
                    .setDescription(
                        'O atendimento foi encerrado e arquivado nas thread.\n' +
                        '\n' +
                        'Informação fornecida:\n' +
                        reason
                    )
            ]
        });
    }
}