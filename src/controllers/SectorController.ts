import Sector from "../models/Sector";
import Sectors from "../../data/sector.json";

class SectorController {

    cache: Map<String, Sector>;

    constructor() {
        this.cache = new Map();
    }

    async start() {
        console.log('[Simple Ticket] [Sector] [INFO]: o controlador de setores foi inicializado.');

        for (const sector of Sectors) {
            this.cache.set(sector.id, new Sector(sector.id, sector.label));
        }

        console.log('[Simple Ticket] [Sector] [INFO]: os setores foram carregados com êxito.');
    }

    async create(category: Sector) {
        this.cache.set(category.id, category);
    }

    async remove(category: Sector) {
        this.cache.delete(category.id);
    }

    getCategoryById(id: string) {
        return Array.from(this.cache.values()).find(category => category.id === id);
    }

    getCategoryByLabel(label: string) {
        return Array.from(this.cache.values()).find(category => category.label === label);
    }
}

export default new SectorController();