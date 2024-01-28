import Database from '../services/DatabaseService';

import Ticket from "../models/Ticket";
import TicketDTO from "../dto/TicketDTO";

class TicketController {

    cache: Map<String, Ticket>;

    constructor() {
        this.cache = new Map();
    }

    async start() {
        console.log('[Simple Ticket] [Ticket] [INFO]: o controlador de atendimentos foi inicializado.');

        const [rows] = await Database.client.query<TicketDTO[]>('SELECT * FROM tickets;');

        for (const row of rows) {
            this.cache.set(row.id, new Ticket(row.id, row.user_id, row.sector_id, row.thread_id));
        }

        console.log('[Simple Ticket] [Ticket] [INFO]: os atendimentos foram carregados com êxito.');
    }

    async create(ticket: Ticket) {
        await Database.client.execute(
            'INSERT INTO tickets (id, sector_id, thread_id, user_id) VALUES (?, ?, ?, ?);',
            [ticket.id, ticket.sector_id, ticket.thread_id, ticket.user_id]
        );

        this.cache.set(ticket.id, ticket);
    }

    async remove(ticket: Ticket) {
        await Database.client.execute(
            'DELETE FROM tickets WHERE id = ?;',
            [ticket.id]
        );

        this.cache.delete(ticket.id);
    }

    getTicketById(id: string) {
        return Array.from(this.cache.values()).find(ticket => ticket.id === id);
    }

    getTicketBySector(sector_id: string) {
        return Array.from(this.cache.values()).find(ticket => ticket.sector_id === sector_id);
    }

    getTicketByThread(thread_id: string) {
        return Array.from(this.cache.values()).find(ticket => ticket.thread_id === thread_id);
    }

    getTicketByUser(user_id: string) {
        return Array.from(this.cache.values()).find(ticket => ticket.user_id === user_id);
    }
}

export default new TicketController();