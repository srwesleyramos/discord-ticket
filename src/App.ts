import CategoryController from './controllers/SectorController';
import DatabaseService from './services/DatabaseService';
import TicketController from './controllers/TicketController';

import {ChatInputCommandInteraction, Client, Interaction} from 'discord.js';
import {readdirSync} from 'node:fs';
import {TOKEN} from '../data/token.json';

import Command from "./interfaces/Command";

class App {

    cache: Map<String, Command>;
    client: Client;

    constructor() {
        this.cache = new Map();
        this.client = new Client({
            intents: [
                "Guilds",
                "GuildMessages",
                "GuildMembers",
                "MessageContent"
            ]
        });

        this.init();
    }

    init() {
        this.client.login(TOKEN).then(async () => {
            this.client.guilds.fetch().then(async () => {
                for (const guild of Array.from(this.client.guilds.cache.values())) {
                    await guild.members.fetch();
                }
            });

            await DatabaseService.start();
            await CategoryController.start();
            await TicketController.start(this.client);

            this.registerCommands();
            this.registerEvents();
            this.registerHandler();
            this.registerWatcher();

            console.info('[Simple Ticket] [App] [INFO]: a aplicação estabeleceu conexão com o Discord.');
        });
    }

    registerCommands() {
        console.info('[Simple Ticket] [Command] [INFO]: iniciando o carregamento dos comandos.');

        readdirSync('./dist/src/commands/').forEach(name => {
            const command = require(`./commands/${name}`).default;
            const instance = new command(this.client);

            console.info(`[Simple Ticket] [Command] [INFO]: o comando ${instance.name} foi registrado.`);

            this.cache.set(instance.name, instance);
        });

        console.info('[Simple Ticket] [Command] [INFO]: os comandos foram carregados com sucesso.');
    }

    registerEvents() {
        console.info('[Simple Ticket] [Event] [INFO]: iniciando o carregamento dos eventos.');

        readdirSync('./dist/src/events/').forEach(name => {
            const listener = require(`./events/${name}`);
            const instance = new listener.default(this.client);

            console.info(`[Simple Ticket] [Event] [INFO]: o evento ${name.substring(0, name.length - 8).toLowerCase()} foi registrado.`);

            this.client.on(instance.name, (...args) => instance.execute(...args));
        });

        console.info('[Simple Ticket] [Event] [INFO]: os eventos foram carregados com sucesso.');
    }

    registerHandler() {
        this.client.on('interactionCreate', async (interaction: Interaction) => {
            if (interaction instanceof ChatInputCommandInteraction) {
                const command = this.cache.get(interaction.commandName);

                if (!command) return;

                await command.execute(interaction);
            }
        });
    }

    registerWatcher() {
        process.on('unhandledRejection', async (reason) => {
            console.error(reason);
        });

        process.on('uncaughtException', async (error) => {
            console.error(error);
        });
    }
}

new App();