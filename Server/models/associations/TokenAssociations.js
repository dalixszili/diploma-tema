import Tokens from "../Tokens.js";
import Users from "../UserModel.js";

// Felhasználok és tokenek összekötési modelje
// One-to-One association
Tokens.belongsTo(Users, {
  as: "user",
  foreignKey: "user_id",
});

Users.hasOne(Tokens, {
  foreignKey: "user_id",
});

export { Tokens, Users };
