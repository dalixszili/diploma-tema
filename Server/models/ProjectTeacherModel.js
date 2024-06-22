import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const ProjectTeachers = db.define(
  "tdk_project_teachers",
  {
    project_id: {
      type: DataTypes.INTEGER,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
    },
    confirmed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    deleted: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
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
