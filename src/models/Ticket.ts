import Sector from "./Sector";

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelManager,
    ChannelType,
    EmbedBuilder,
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

        this.sector_id = sector.id;
        this.thread_id = thread.id;

        await this.welcomeMessage(sector, thread.client.channels);
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
}