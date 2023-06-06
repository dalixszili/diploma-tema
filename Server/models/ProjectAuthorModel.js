import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const ProjectAuthors = db.define(
  "tdk_project_authors",
  {
    project_id: {
      type: DataTypes.INTEGER,
    },
    author_id: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: false, freezeTableName: true, tableName: "tdk_project_authors" }
);

export default ProjectAuthors;
