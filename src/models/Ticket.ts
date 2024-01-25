export default class Ticket {

    readonly id: string;
    readonly user_id: string;

    sector_id: string | null;
    thread_id: string | null;

    constructor(id: string, user_id: string, sector_id?: string, thread_id?: string) {
        this.id = id;
        this.sector_id = sector_id ?? null;
        this.thread_id = thread_id ?? null;
        this.user_id = user_id;
    }
}