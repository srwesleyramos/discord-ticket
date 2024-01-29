import Command from "../interfaces/Command";

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";

export default class InterfaceCommand extends Command {

    constructor(client: Client) {
        super(client, 'interface');
    }

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            content: '<:right_arrow:975008491968290866> a interface para atendimentos foi enviada.',
            ephemeral: true
        });

        const channel = interaction.channel as TextChannel;

        await channel.send({
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("create-ticket")
                                .setLabel("Criar novo atendimento")
                                .setStyle(ButtonStyle.Primary)
                        ] as any
                    )
            ],
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: 'Informações sobre atendimento',
                        iconURL: interaction.client.user.avatarURL() ?? interaction.client.user.defaultAvatarURL
                    })
                    .setDescription(
                        'Olá! Bem-vindo ao nosso sistema de atendimento ao cliente!\n' +
                        'Estamos aqui para ajudar. Por favor, descreva o seu problema ou pergunta e, ao enviar a mensagem, selecione o setor mais adequado para garantir que a sua solicitação seja encaminhada para a equipe especializada.\n' +
                        '\n' +
                        'Ficamos à disposição para fornecer a assistência necessária.\n' +
                        'Lembre-se de ser específico para que possamos resolver seu problema de maneira rápida e eficiente.\n' +
                        '\n' +
                        'Horário comercial:\n' +
                        '<:right_arrow:975008491968290866> segunda a sexta: 08:00 - 18:00\n' +
                        '<:right_arrow:975008491968290866> sábado e domingo: 08:00 - 13:00'
                    )
            ]
        });
    }

    getSlashCommand() {
        return new SlashCommandBuilder()
            .setName('interface')
            .setDescription('Envie a interface para criação de atendimentos.')
            .setDMPermission(false)
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    }
}