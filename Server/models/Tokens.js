import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Tokens = db.define(
  "tdk_tokens",
  {
    user_id: {
      type: DataTypes.INTEGER,
      // autoIncrement: true,
      // primaryKey: true,
      // allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tokenExpires: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal(
        "DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 HOUR)"
      ),
    },
  },
  {
    // timestamps: false,
    freezeTableName: true,
    tableName: "tdk_tokens",
  }
);

export default Tokens;
