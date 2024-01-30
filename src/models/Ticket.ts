import Sector from "./Sector";

import {ChannelType, TextChannel} from "discord.js";

import {v4 as uuid} from "uuid";

export default class Ticket {

    readonly id: string;
    readonly user_id: string;

    sector_id: string | null;
    thread_id: string | null;

    constructor(id: string | null, user_id: string, sector_id?: string, thread_id?: string) {
        this.id = id ?? uuid();
        this.sector_id = sector_id ?? null;
        this.thread_id = thread_id ?? null;
        this.user_id = user_id;
    }

    async open(sector: Sector, reason: string, parent: TextChannel) {
        const thread = await parent.threads.create({
            name: reason,
            invitable: false,
            type: ChannelType.PrivateThread
        });

        this.sector_id = sector.id;
        this.thread_id = thread.id;
    }
}