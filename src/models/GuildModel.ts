class GuildModel {

    readonly guild_id: string;

    interface_channel: string;
    interface_enabled: boolean;
    interface_message: string;

    review_channel: string;
    review_enabled: boolean;
    review_message: string;

    constructor(guild_id: string, interface_channel: string, interface_enabled: boolean, interface_message: string, review_channel: string, review_enabled: boolean, review_message: string) {
        this.guild_id = guild_id;
        this.interface_channel = interface_channel;
        this.interface_enabled = interface_enabled;
        this.interface_message = interface_message;
        this.review_channel = review_channel;
        this.review_enabled = review_enabled;
        this.review_message = review_message;
    }

    // clearInterface()
    // sendInterface()
}

export default GuildModel;