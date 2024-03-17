import {Collection, Guild, GuildMember, Snowflake} from "discord.js";

class SectorModel {

    readonly sector_id: string;
    readonly guild_id: string;

    display: string;
    role_id: string;

    constructor(sector_id: string, guild_id: string, display: string, role_id: string) {
        this.sector_id = sector_id;
        this.guild_id = guild_id;
        this.display = display;
        this.role_id = role_id;
    }

    // show(thread);
    // hide(thread);

    async fetch(guild: Guild) {
        const role = await guild.roles.fetch(this.role_id, {force: true});

        return role?.members ?? new Collection<Snowflake, GuildMember>();
    }
}

export default SectorModel;