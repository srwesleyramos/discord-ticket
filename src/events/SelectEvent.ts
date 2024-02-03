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

export default class SelectEvent extends Listener {

    constructor(client: Client) {
        super(client, 'interactionCreate');
    }

    async execute(interaction: Interaction) {
        if (!(interaction instanceof StringSelectMenuInteraction)) {
            return;
        }

        if (interaction.customId === 'create-ticket') {
            await this.createTicket(interaction);
        }

        if (interaction.customId === 'transfer-ticket') {
            await this.transferTicket(interaction);
        }
    }

    async createTicket(interaction: StringSelectMenuInteraction) {
        const sector = Sectors.getSectorById(interaction.values[0]);

        if (!sector) {
            return;
        }

        const input = new TextInputBuilder()
            .setCustomId('reason')
            .setLabel("Descreva o seu problema")
            .setStyle(TextInputStyle.Short)
            .setMinLength(16)
            .setMaxLength(64);

        const row = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                input as any
            );

        const modal = new ModalBuilder()
            .setCustomId(`create-ticket:${sector.id}`)
            .setTitle(sector.label)
            .addComponents(
                row as any
            );

        await interaction.showModal(modal);
    }

    async transferTicket(interaction: StringSelectMenuInteraction) {
        const sector = Sectors.getSectorById(interaction.values[0]);

        if (!sector) {
            return;
        }

        const input = new TextInputBuilder()
            .setCustomId('reason')
            .setLabel("Descreva o motivo")
            .setStyle(TextInputStyle.Short)
            .setMinLength(16)
            .setMaxLength(64);

        const row = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                input as any
            );

        const modal = new ModalBuilder()
            .setCustomId(`transfer-ticket:${sector.id}`)
            .setTitle(sector.label)
            .addComponents(
                row as any
            );

        await interaction.showModal(modal);
    }
}