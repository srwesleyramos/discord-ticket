export default class Ticket {

    readonly id: string;
    readonly user_id: string;

    role_id: string | null;
    thread_id: string | null;

    constructor(id: string, user_id: string, role_id?: string, thread_id?: string) {
        this.id = id;
        this.role_id = role_id ?? null;
        this.thread_id = thread_id ?? null;
        this.user_id = user_id;
    }
}