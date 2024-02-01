import Listener from "../interfaces/Listener";
import Sectors from "../controllers/SectorController";
import Tickets from "../controllers/TicketController";

import {
    ActionRowBuilder,
    ButtonInteraction,
    Client,
    Interaction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
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

        if (interaction.customId === 'close-ticket') {
            const ticket = Tickets.getTicketByThread(interaction.channelId);

            if (!ticket) {
                return;
            }

            await interaction.reply({
                content: 'O atendimento foi encerrado com sucesso.',
                ephemeral: true
            });

            await ticket.close(interaction.client.channels, 'Atendimento finalizado com sucesso.');
        }
    }
}