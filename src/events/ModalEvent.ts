import Listener from "../interfaces/Listener";
import Sectors from "../controllers/SectorController";
import Tickets from "../controllers/TicketController";

import {Client, Interaction, ModalSubmitInteraction, TextChannel} from "discord.js";

import Ticket from "../models/Ticket";

export default class ModalEvent extends Listener {

    constructor(client: Client) {
        super(client, 'interactionCreate');
    }

    async execute(interaction: Interaction) {
        if (!(interaction instanceof ModalSubmitInteraction) || !interaction.customId.startsWith('create-ticket')) {
            return;
        }

        const sector = Sectors.getSectorById(interaction.customId.substring(14));

        if (!sector) {
            return;
        }

        await interaction.reply({
            content: 'Aguarde...',
            ephemeral: true
        })

        const ticket = new Ticket(null, interaction.user.id);

        await ticket.open(sector, interaction.fields.getTextInputValue('reason'), interaction.channel as TextChannel);

        await interaction.followUp({
            content: `O seu atendimento foi criado, use o canal: <#${ticket.thread_id}>`,
            ephemeral: true
        });

        await Tickets.create(ticket);
    }
}