import {RowDataPacket} from "mysql2";

export default interface SectorDTO extends RowDataPacket {
    id: string;
    label: string;
    role_id: string;
}