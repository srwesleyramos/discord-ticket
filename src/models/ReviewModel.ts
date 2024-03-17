import Stars from "../enums/Stars";

class ReviewModel {

    readonly review_id: string;
    readonly author_id: string;
    readonly guild_id: string;
    readonly ticket_id: string;

    notes: string | null;
    stars: Stars;
    reason: string | null;

    constructor(review_id: string, author_id: string, guild_id: string, ticket_id: string, stars: Stars, reason: string | null, notes: string | null) {
        this.review_id = review_id;
        this.author_id = author_id;
        this.guild_id = guild_id;
        this.ticket_id = ticket_id;
        this.notes = notes;
        this.stars = stars;
        this.reason = reason;
    }

    // publish
}

export default ReviewModel;