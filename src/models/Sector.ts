import {Collection, Guild, GuildMember, Snowflake} from "discord.js";

export default class Sector {

    readonly id: string;
    readonly label: string;

    constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
    }

    async get(guild: Guild) {
        const role = await guild.roles.fetch(this.id, {cache: true});

        return role?.members ?? new Collection<Snowflake, GuildMember>();
    }
}