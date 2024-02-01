import Listener from "../interfaces/Listener";
import Sectors from "../controllers/SectorController";

import {
    ActionRowBuilder,
    Client,
    Interaction,
    ModalBuilder,
    StringSelectMenuInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export default class TicketSelectEvent extends Listener {

    constructor(client: Client) {
        super(client, 'interactionCreate');
    }

    async execute(interaction: Interaction) {
        if (!(interaction instanceof StringSelectMenuInteraction) || interaction.customId !== 'create-ticket') {
            return;
        }

        const sector = Sectors.getSectorById(interaction.values[0]);

        if (!sector) {
            return;
        }

        const modal = new ModalBuilder()
            .setCustomId(`create-ticket:${sector.id}`)
            .setTitle(sector.label)
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('reason')
                            .setLabel("Descreva o seu problema")
                            .setStyle(TextInputStyle.Short)
                            .setMinLength(12)
                            .setMaxLength(32) as any
                    ) as any
            );

        await interaction.showModal(modal);
    }
}