import Database from "../services/DatabaseService";

import SectorModel from "../models/SectorModel";
import SectorDto from "../dto/SectorDto";

class SectorController {

    cache: Map<String, SectorModel>;

    constructor() {
        this.cache = new Map();
    }

    async start() {
        console.info('[Simple TicketModel] [SectorModel] [INFO]: o controlador de setores foi inicializado.');

        const [rows] = await Database.query<SectorDto[]>('SELECT * FROM sectors;');

        for (const row of rows) {
            this.cache.set(row.id, new SectorModel(row.id, row.label, row.role_id));
        }

        console.info('[Simple TicketModel] [SectorModel] [INFO]: os setores foram carregados com êxito.');
    }

    async create(sector: SectorModel) {
        await Database.query(
            'INSERT INTO sectors (id, label, role_id) VALUES (?, ?, ?);',
            [sector.id, sector.label, sector.role_id]
        );

        this.cache.set(sector.id, sector);
    }

    async remove(sector: SectorModel) {
        await Database.query(
            'DELETE FROM sectors WHERE id = ?;',
            [sector.id]
        );

        this.cache.delete(sector.id);
    }

    async update(sector: SectorModel) {
        await Database.query(
            'UPDATE sectors SET label = ?, role_id = ? WHERE id = ?;',
            [sector.label, sector.role_id, sector.id]
        );

        this.cache.set(sector.id, sector);
    }

    getSectorById(id: string) {
        return Array.from(this.cache.values()).find(sector => sector.id === id);
    }

    getSectorByLabel(label: string) {
        return Array.from(this.cache.values()).find(sector => sector.label === label);
    }

    getSectorByRole(role_id: string) {
        return Array.from(this.cache.values()).find(sector => sector.role_id === role_id);
    }
}

export default new SectorController();