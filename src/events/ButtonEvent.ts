import Listener from "../interfaces/Listener";
import Sectors from "../controllers/SectorController";
import Tickets from "../controllers/TicketController";

import {
    ActionRowBuilder,
    ButtonInteraction,
    Client,
    Interaction,
    ModalBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export default class ButtonEvent extends Listener {

    constructor(client: Client) {
        super(client, 'interactionCreate');
    }

    async execute(interaction: Interaction) {
        if (!(interaction instanceof ButtonInteraction)) {
            return
        }

        if (interaction.customId === 'create-ticket') {
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`create-ticket`)
                .setPlaceholder('Selecione o setor adequado')
                .addOptions(
                    Array.from(Sectors.cache.values())
                        .map(sector =>
                            new StringSelectMenuOptionBuilder()
                                .setLabel(sector.label)
                                .setDescription(sector.id)
                                .setValue(sector.id)
                        ) as any
                );

            await interaction.reply({
                content: 'Qual o setor você quer abrir o atendimento?',
                components: [
                    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu as any)
                ],
                ephemeral: true
            });
        }

        if (interaction.customId === 'change-sector') {
            const ticket = Tickets.getTicketByThread(interaction.channelId);

            if (!ticket) {
                return;
            }

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`change-sector`)
                .setPlaceholder('Selecione o setor adequado')
                .addOptions(
                    Array.from(Sectors.cache.values())
                        .filter(sector => sector.id !== ticket.sector_id)
                        .map(sector =>
                            new StringSelectMenuOptionBuilder()
                                .setLabel(sector.label)
                                .setDescription(sector.id)
                                .setValue(sector.id)
                        ) as any
                );

            await interaction.reply({
                content: 'Qual o setor você quer transferir o atendimento?',
                components: [
                    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu as any)
                ],
                ephemeral: true
            });
        }

        if (interaction.customId === 'close-ticket') {
            const modal = new ModalBuilder()
                .setCustomId(`close-ticket`)
                .setTitle('Encerrar atendimento')
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('reason')
                                .setLabel("Qual o resultado do atendimento?")
                                .setStyle(TextInputStyle.Short)
                                .setMinLength(8)
                                .setMaxLength(64) as any
                        ) as any
                );

            await interaction.showModal(modal);
        }
    }
}