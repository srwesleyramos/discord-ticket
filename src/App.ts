import DatabaseService from './services/DatabaseService';

import CategoryController from './controllers/SectorController';
import TicketController from './controllers/TicketController';

import Command from "./interfaces/Command";

import {ChatInputCommandInteraction, Client, Interaction} from 'discord.js';
import {readdirSync} from 'node:fs';
import {TOKEN} from '../data/token.json';

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

            process.on('unhandledRejection', async (reason) => {
                console.error(reason); // adicionando durante fase de testes.
            })

            process.on('uncaughtException', async (reason) => {
                console.error(reason); // adicionando durante fase de testes.
            })

            console.log('[Simple Ticket] [App] [INFO]: a aplicação estabeleceu conexão com o Discord.');
        });
    }

    registerCommands() {
        readdirSync('./dist/src/commands/').forEach(name => {
            const Command = require(`./commands/${name}`);
            const command = new Command.default(this.client);

            this.cache.set(command.name, command);
        });

        console.log('[Simple Ticket] [App] [INFO]: os comandos foram carregados com sucesso.');
    }

    registerEvents() {
        readdirSync('./dist/src/events/').forEach(name => {
            const Listener = require(`./events/${name}`);
            const listener = new Listener.default(this.client);

            this.client.on(listener.name, (...args) => listener.execute(...args));
        });

        console.log('[Simple Ticket] [App] [INFO]: os eventos foram carregados com sucesso.');
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
}

new App();