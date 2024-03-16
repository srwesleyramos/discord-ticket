import {RowDataPacket} from "mysql2";

export default interface SectorDto extends RowDataPacket {
    id: string;
    label: string;
    role_id: string;
}