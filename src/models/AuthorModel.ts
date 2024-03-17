class AuthorModel {

    readonly author_id: string;
    readonly guild_id: string;
    readonly member_id: string;

    constructor(author_id: string, guild_id: string, member_id: string) {
        this.author_id = author_id;
        this.guild_id = guild_id;
        this.member_id = member_id;
    }
}

export default AuthorModel;