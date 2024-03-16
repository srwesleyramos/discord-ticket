import config from '../../data/mysql.json';
import mysql, {FieldPacket, Pool, RowDataPacket} from 'mysql2/promise';

class DatabaseService {

    private pool: Pool;

    async start() {
        console.info('[Simple TicketModel] [Database] [INFO]: iniciando conexão ao banco de dados...');

        this.pool = await mysql.createPool({
            host: config.MYSQL_HOSTNAME,
            user: config.MYSQL_USERNAME,
            password: config.MYSQL_PASSWORD,
            database: config.MYSQL_DATABASE,
            waitForConnections: true
        });

        await this.query(`
            CREATE TABLE IF NOT EXISTS sectors
            (
                id      VARCHAR(36)  NOT NULL,
                label   VARCHAR(255) NOT NULL,
                role_id VARCHAR(36)  NOT NULL,
                PRIMARY KEY (id)
            );
        `);

        await this.query(`
            CREATE TABLE IF NOT EXISTS tickets
            (
                id        VARCHAR(36) NOT NULL,
                sector_id VARCHAR(36) NOT NULL,
                thread_id VARCHAR(36) NOT NULL,
                user_id   VARCHAR(36) NOT NULL,
                PRIMARY KEY (id)
            );
        `);

        console.info('[Simple TicketModel] [Database] [INFO]: a conexão com o banco de dados foi aberta.');
    }

    async query<
        T extends | RowDataPacket[]
    >(sql: string, values?: any): Promise<[T, FieldPacket[]]> {
        const connection = await this.pool.getConnection();

        return await connection.query(sql, values);
    }
}

export default new DatabaseService();