import Sectors from "../controllers/SectorController";
import Tickets from "../controllers/TicketController";

import {Client, Interaction, ModalSubmitInteraction, TextChannel} from "discord.js";

import Listener from "../interfaces/Listener";
import Ticket from "../models/Ticket";

export default class ModalEvent extends Listener {

    constructor(client: Client) {
        super(client, 'interactionCreate');
    }

    async execute(interaction: Interaction) {
        if (!(interaction instanceof ModalSubmitInteraction)) {
            return;
        }

        if (interaction.customId.startsWith('create-ticket')) {
            await this.createTicket(interaction);
        }

        if (interaction.customId === 'close-ticket') {
            await this.closeTicket(interaction);
        }

        if (interaction.customId.startsWith('transfer-ticket')) {
            await this.transferTicket(interaction);
        }
    }

    async createTicket(interaction: ModalSubmitInteraction) {
        const sector = Sectors.getSectorById(interaction.customId.substring(14));

        if (!sector) {
            return;
        }

        await interaction.reply({
            content: 'Criando seu atendimento, aguarde...',
            ephemeral: true
        });

        const channel = interaction.channel as TextChannel;
        const reason = interaction.fields.getTextInputValue('reason');

        const ticket = new Ticket(null, interaction.user.id);
        await ticket.open(sector, channel, reason);

        await interaction.followUp({
            content: `O seu atendimento foi criado, use o canal: <#${ticket.thread_id}>`,
            ephemeral: true
        });

        await Tickets.create(ticket);
    }

    async closeTicket(interaction: ModalSubmitInteraction) {
        if (!interaction.channelId) {
            return;
        }

        const ticket = Tickets.getTicketByThread(interaction.channelId);

        if (!ticket) {
            return;
        }

        await interaction.reply({
            content: 'O atendimento foi encerrado com sucesso.',
            ephemeral: true
        });

        await ticket.close(interaction.client.channels, interaction.fields.getTextInputValue('reason'));
    }

    async transferTicket(interaction: ModalSubmitInteraction) {
        if (!interaction.channelId) {
            return;
        }

        const sector = Sectors.getSectorById(interaction.customId.substring(16));

        if (!sector) {
            return;
        }

        const ticket = Tickets.getTicketByThread(interaction.channelId);

        if (!ticket) {
            return;
        }

        await interaction.reply({
            content: 'O atendimento foi transferido com sucesso.',
            ephemeral: true
        });

        await ticket.transfer(sector, interaction.client.channels, interaction.fields.getTextInputValue('reason'));
    }
}