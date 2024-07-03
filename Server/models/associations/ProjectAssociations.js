import Users from "../UserModel.js";
import Categories from "../CategoryModel.js";
import Projects from "../ProjectModel.js";
import Authors from "../AuthorModel.js";
import Teachers from "../TeacherModel.js";
import ProjectAuthors from "../ProjectAuthorModel.js";
import ProjectTeachers from "../ProjectTeacherModel.js";

// Projektek és kategóriák összekötési modellje
// One-to-Many association
Projects.belongsTo(Categories, {
  as: "category",
  foreignKey: "category_id",
});

Categories.hasMany(Projects, {
  foreignKey: "id",
});

// Projektek és azon felhasználók, amelyek létrehozták azt összekötési modellje
// One-to-Many association
Projects.belongsTo(Users, {
  as: "user",
  foreignKey: "user_id",
});

Users.hasMany(Projects, {
  foreignKey: "id",
});

// Projektek és szerzők összekötési modellje
// Many-to-Many aasociation
Projects.belongsToMany(Authors, {
  through: ProjectAuthors,
  as: "authors",
  foreignKey: "project_id",
});

Authors.belongsToMany(Projects, {
  through: ProjectAuthors,
  foreignKey: "author_id",
});

// Projektek és tanárók  összekötési modellje
// Many-to-Many aasociation
Projects.belongsToMany(Teachers, {
  through: ProjectTeachers,
  as: "teachers",
  foreignKey: "project_id",
});

Teachers.belongsToMany(Projects, {
  through: ProjectTeachers,
  foreignKey: "teacher_id",
});

export { Categories, Users, Projects, Authors, Teachers };
