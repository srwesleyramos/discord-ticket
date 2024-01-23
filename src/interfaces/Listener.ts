import {Client} from "discord.js";

export default class Listener {

    client: Client;
    name: String;

    constructor(client: Client, name: String) {
        this.client = client;
        this.name = name;
    }

    async execute(...args: any) {
        console.log('o listener', this.name, 'não foi implementado.');
    }
}