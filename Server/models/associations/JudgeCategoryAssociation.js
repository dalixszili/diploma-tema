// Projektek és szerzők összekötési modelje
import Categories from "../CategoryModel.js";
import JudgeCategory from "../JudgeCategoryModel.js";
import Users from "../UserModel.js";

// Many-to-Many aasociation

Categories.belongsToMany(Users, {
  through: JudgeCategory,
  as: "category",
  foreignKey: "category_id",
});

Users.belongsToMany(Categories, {
  through: JudgeCategory,
  foreignKey: "judge_id",
});

export { Users, Categories, JudgeCategory };
