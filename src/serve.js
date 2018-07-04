import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();


function sqlConnectionConfig(sqlClient) {
  if (sqlClient === 'sqlite3') {
    return { filename: process.env.DB_HOST };
  }
  return {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'TestDB',
  };
}

// More customized configurations here:  https://knexjs.org/#Installation-client
const sql = knex.connection({
  client: process.env.SQL_CLIENT,
  connection: sqlConnectionConfig(process.env.SQL_CLIENT),
});


// Create the database
sql();
sql.raw(`CREATE DATABASE ${process.env.DB_NAME}`)
  .then(() => {
    sql.destroy();
  });
// reconnect
sql();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send({ server: 'online' });
});

app.listen(PORT, () => {
  console.info(`Web server started on port ${PORT}! Happy coding!
  `);
});

process.on('SIGINT', () => {
  app.close(() => {
    console.error('Program has unexpectedly stopped. Gracefully disconnecting from db and stopping server');
    sql.destroy();
    process.exit(1);
  });
});

// for tests
export default app;
