import { Sequelize } from "sequelize";

const db = new Sequelize("simple_crud", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

export default db;

