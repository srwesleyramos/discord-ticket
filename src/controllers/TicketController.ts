import Database from '../services/DatabaseService';

import {Client} from "discord.js";

import TicketModel from "../models/TicketModel";
import TicketDto from "../dto/TicketDto";

class TicketController {

    cache: Map<String, TicketModel>;

    constructor() {
        this.cache = new Map();
    }

    async start(client: Client) {
        console.info('[Simple TicketModel] [TicketModel] [INFO]: o controlador de atendimentos foi inicializado.');

        const [rows] = await Database.query<TicketDto[]>('SELECT * FROM tickets;');

        for (const row of rows) {
            const ticket = new TicketModel(row.id, row.user_id, row.sector_id, row.thread_id);
            await ticket.init(client.channels);

            this.cache.set(row.id, ticket);
        }

        console.info('[Simple TicketModel] [TicketModel] [INFO]: os atendimentos foram carregados com êxito.');
    }

    async create(ticket: TicketModel) {
        await Database.query(
            'INSERT INTO tickets (id, sector_id, thread_id, user_id) VALUES (?, ?, ?, ?);',
            [ticket.id, ticket.sector_id, ticket.thread_id, ticket.user_id]
        );

        this.cache.set(ticket.id, ticket);
    }

    async remove(ticket: TicketModel) {
        await Database.query(
            'DELETE FROM tickets WHERE id = ?;',
            [ticket.id]
        );

        this.cache.delete(ticket.id);
    }

    async update(ticket: TicketModel) {
        await Database.query(
            'UPDATE tickets SET sector_id = ?, thread_id = ?, user_id = ? WHERE id = ?;',
            [ticket.sector_id, ticket.thread_id, ticket.user_id, ticket.id]
        );

        this.cache.set(ticket.id, ticket);
    }

    getTicketById(id: string) {
        return Array.from(this.cache.values()).find(ticket => ticket.id === id);
    }

    getTicketBySector(sector_id: string) {
        return Array.from(this.cache.values()).filter(ticket => ticket.sector_id === sector_id);
    }

    getTicketByThread(thread_id: string) {
        return Array.from(this.cache.values()).find(ticket => ticket.thread_id === thread_id);
    }

    getTicketByUser(user_id: string) {
        return Array.from(this.cache.values()).filter(ticket => ticket.user_id === user_id);
    }
}

export default new TicketController();