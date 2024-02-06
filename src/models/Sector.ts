import {Collection, Guild, GuildMember, Snowflake} from "discord.js";

export default class Sector {

    readonly id: string;
    readonly label: string;
    readonly role_id: string;

    constructor(id: string, label: string, role_id: string) {
        this.id = id;
        this.label = label;
        this.role_id = role_id;
    }

    async get(guild: Guild) {
        const role = await guild.roles.fetch(this.role_id, {cache: true});

        return role?.members ?? new Collection<Snowflake, GuildMember>();
    }
}