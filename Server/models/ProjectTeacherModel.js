import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const ProjectTeachers = db.define(
  "tdk_project_teachers",
  {
    project_id: {
      type: DataTypes.INTEGER,
    },
    author_id: {
      type: DataTypes.INTEGER,
    },
    konfirmed: {
      type: DataTypes.Integer,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "tdk_project_teachers",
  }
);

export default ProjectTeachers;
