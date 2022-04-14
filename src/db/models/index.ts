import * as fs from "fs";
import * as path from "path";
import { Sequelize } from "sequelize";
import { Stage } from "../../utils/stage";

const basename = path.basename(__filename);
const env = process.env || Stage.Dev;
const db: any = {};

let sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    define: {
      timestamps: false,
    },
    quoteIdentifiers: true,
  }
);

fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file: any) => {
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
