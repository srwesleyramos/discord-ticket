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
            await this.createTicket(interaction);
        }

        if (interaction.customId === 'close-ticket') {
            await this.closeTicket(interaction);
        }

        if (interaction.customId === 'transfer-ticket') {
            await this.transferTicket(interaction);
        }
    }

    async createTicket(interaction: ButtonInteraction) {
        const options = Array.from(Sectors.cache.values())
            .map(sector =>
                new StringSelectMenuOptionBuilder()
                    .setLabel(sector.label)
                    .setDescription(sector.id)
                    .setValue(sector.id)
            );

        const select = new StringSelectMenuBuilder()
            .setCustomId('create-ticket')
            .setPlaceholder('Selecione o setor para atendimento')
            .addOptions(
                options as any
            );

        await interaction.reply({
            content: 'Qual o setor você quer abrir o atendimento?',
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select as any)
            ],
            ephemeral: true
        });
    }

    async closeTicket(interaction: ButtonInteraction) {
        const input = new TextInputBuilder()
            .setCustomId('reason')
            .setLabel("Observações")
            .setMinLength(8)
            .setMaxLength(128)
            .setStyle(TextInputStyle.Short)

        const row = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                input as any
            );

        const modal = new ModalBuilder()
            .setCustomId('close-ticket')
            .setTitle('Encerrar atendimento')
            .addComponents(
                row as any
            );

        await interaction.showModal(modal);
    }

    async transferTicket(interaction: ButtonInteraction) {
        const ticket = Tickets.getTicketByThread(interaction.channelId);

        if (!ticket) {
            return;
        }

        const options = Array.from(Sectors.cache.values())
            .filter(sector => sector.id !== ticket.sector_id)
            .map(sector =>
                new StringSelectMenuOptionBuilder()
                    .setLabel(sector.label)
                    .setDescription(sector.id)
                    .setValue(sector.id)
            );

        const select = new StringSelectMenuBuilder()
            .setCustomId('transfer-ticket')
            .setPlaceholder('Qual o setor do atendimento?')
            .addOptions(
                options as any
            );

        await interaction.reply({
            content: 'Para qual setor o atendimento será transferido?',
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select as any)
            ],
            ephemeral: true
        });
    }
}