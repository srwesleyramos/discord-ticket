import {RowDataPacket} from "mysql2";

export default interface TicketDto extends RowDataPacket {
    id: string;
    sector_id: string;
    thread_id: string;
    user_id: string;
}