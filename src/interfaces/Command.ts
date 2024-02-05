import {ChatInputCommandInteraction, Client, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder} from "discord.js";

export default class Command {

    readonly client: Client;
    readonly name: String;

    constructor(client: Client, name: String) {
        this.client = client;
        this.name = name;
    }

    async execute(interaction: ChatInputCommandInteraction) {
        console.info('o comando', this.name, 'não foi implementado.');
    }

    getSlashCommand(): SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder {
        throw new Error(`o comando ${this.name} não foi implementado.`);
    }
}