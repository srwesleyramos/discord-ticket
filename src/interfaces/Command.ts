import {ChatInputCommandInteraction, Client} from "discord.js";

export default class Command {

    client: Client;
    name: String;

    constructor(client: Client, name: String) {
        this.client = client;
        this.name = name;
    }

    async execute(interaction: ChatInputCommandInteraction) {
        console.log('o comando', this.name, 'não foi implementado.');
    }
}