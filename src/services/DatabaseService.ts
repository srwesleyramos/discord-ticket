import config from '../../data/mysql.json';
import mysql, {Connection} from 'mysql2/promise';

class DatabaseService {

    client: Connection;

    async start() {
        console.log('[Simple Ticket] [Database] [INFO]: iniciando conexão ao banco de dados...');

        this.client = await mysql.createConnection({
            enableKeepAlive: true,
            host: config.MYSQL_HOSTNAME,
            user: config.MYSQL_USERNAME,
            password: config.MYSQL_PASSWORD,
            database: config.MYSQL_DATABASE
        });

        await this.client.query(`
            CREATE TABLE IF NOT EXISTS tickets
            (
                id        VARCHAR(36) NOT NULL,
                sector_id VARCHAR(36) NOT NULL,
                thread_id VARCHAR(36) NOT NULL,
                user_id   VARCHAR(36) NOT NULL,
                PRIMARY KEY (id)
            );
        `);

        console.log('[Simple Ticket] [Database] [INFO]: a conexão com o banco de dados foi aberta.');
    }
}

export default new DatabaseService();