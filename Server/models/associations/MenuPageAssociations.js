import Menus from "../MenuModel.js";
import Pages from "../PageModel.js";

// Menűk és oldalak összekötési modelje
// One-to-Many association
Menus.belongsTo(Pages, {
  as: "page",
  foreignKey: "page_id",
});

// Pages.hasMany(Menus, {
//   foreignKey: "id",
// });

export { Menus, Pages };
