import { Tokens } from "../models/associations/TokenAssociations.js";
import EmailSender from "../config/EmailSender.js";
import crypto from "crypto";
import Users from "../models/UserModel.js";
import argon2 from "argon2";
import { Sequelize, where } from "sequelize";
import EmailVerification from "../config/emailForms/EmailVerification.js";
import EmailResetPassword from "../config/emailForms/EmailResetPassword.js";

const Op = Sequelize.Op;

// Bejelentkezés
export const logIn = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
      deleted: 0,
    },
  });
  if (!user) return res.status(404).json({ msg: "Helytelen E-mail cím ! " });
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) {
    return res.status(400).json({
      msg: "Helytelen jelszó ! Ha elfelejtette a jelszavát akkor kattintson az elfelejtettem a jelszavam gombra !",
    });
  }

  if (!user.verified && user.role !== 1) {
    const token = await Tokens.findOne({
      where: { user_id: user.id },
    });
    if (token) {
      // console.log(token.tokenExpires);
      // console.log(new Date(token.tokenExpires));
      // console.log(new Date(token.tokenExpires) < new Date());
      if (new Date(token.tokenExpires) < new Date()) {
        await token.update({
          token: crypto.randomBytes(32).toString("hex"),
          tokenExpires: Sequelize.literal(
            "DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 HOUR)"
          ),
        });

        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
        EmailSender(
          user.email,
          "E-mail cím visszaigazolása",
          EmailVerification(url)
        );
      }
    } else {
      const newToken = await Tokens.create({
        user_id: user.id,
        token: crypto.randomBytes(32).toString("hex"),
      });

      const url = `${process.env.BASE_URL}users/${user.id}/verify/${newToken.token}`;
      EmailSender(
        user.email,
        "E-mail cím visszaigazolása",
        EmailVerification(url)
      );
    }

    return res.status(400).json({
      msg: "Egy üzenetet küldtünk az e-mail címére, kérjük ellenőrizze ",
    });
  }

  req.session.userId = user.id;
  const id = user.id;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  res.status(200).json({ id, name, email, role });
};

// Create User
export const register = async (req, res) => {
  const { name, email, password, confpassword } = req.body;

  if (password !== confpassword)
    return res.status(400).json({ msg: "A két jelszó nem egyezik ! " });

  const user = await Users.findOne({
    where: {
      email: email,
    },
  });
  if (user) {
    if (user.deleted === 1) {
      await Users.destroy({
        where: {
          id: user.id,
        },
      });
    } else {
      if (user.deleted === 0) {
        return res.status(302).json({
          msg: "A megadott e-mail cím már foglalt. Ha elfelejtette a jelszavát akkor kattintson az elfelejtettem a jelszavam gombra a bejelentkezési ablakban. ",
        });
      }
    }
  }

  const hashPassword = await argon2.hash(password);
  try {
    const newuser = await Users.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    const token = await Tokens.create({
      user_id: newuser.id,
      token: crypto.randomBytes(32).toString("hex"),
    });

    const url = `${process.env.BASE_URL}users/${newuser.id}/verify/${token.token}`;
    EmailSender(
      newuser.email,
      "E-mail cím visszaigazolása",
      EmailVerification(url)
    );

    res.status(201).json({
      msg: "Egy üzenetet küldtünk a megadott e-mail címre, ennek segitségével kérjük igazolja vissza e-mail címét ! ",
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const findMe = async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ msg: "User not loggedin !" });

  const user = await Users.findOne({
    where: {
      id: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found ! " });
  const id = user.id;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  res.status(200).json({ id, name, email, role });
};

export const logOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: err.message });
    res.status(200).json({ msg: "Logout successfully !" });
  });
};

// Email visszaigazolás
export const verifyEmail = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { id: req.params.id, deleted: 0 },
    });

    if (!user) {
      return res.status(400).json({ msg: "Érvénytelen link " });
    }

    const token = await Tokens.findOne({
      where: {
        user_id: user.id,
        token: req.params.token,
        tokenExpires: {
          [Op.gte]: new Date(),
        },
      },
    });

    if (!token) {
      return res.status(400).json({ msg: "Érvénytelen link ! " });
    }

    await user.update({ verified: true });
    await token.destroy();

    res.status(200).json({ msg: "Sikeres visszaigazolás! " });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// Jelszó visszaállítása
export const resetPassword = async (req, res) => {
  const { password, confpassword } = req.body;

  if (password !== confpassword)
    return res.status(400).json({ msg: "A két jelszó nem egyezik ! " });

  try {
    const user = await Users.findOne({
      where: { id: req.params.id, deleted: 0, verified: 1 },
    });

    if (!user) {
      return res.status(400).json({
        msg: " Érvénytelen link !  ",
      });
    }

    const token = await Tokens.findOne({
      where: {
        user_id: user.id,
        token: req.params.token,
        tokenExpires: {
          [Op.gte]: new Date(),
        },
      },
    });

    if (!token) {
      return res.status(400).json({ msg: "Érvénytelen link ! " });
    }

    const hashPassword = await argon2.hash(password);

    await user.update({
      password: hashPassword,
    });
    await token.destroy();

    res.status(200).json({ msg: " Jelszó sikeresen modósítva ! " });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
// Jelszó visszaállításást igénylő e-mail küldése
export const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({
      where: { email: email, deleted: 0 },
    });

    if (!user) {
      return res
        .status(400)
        .json({ msg: " A megadott e-mail cím nem található !" });
    }

    await Tokens.destroy({
      where: {
        user_id: user.id,
      },
    });

    const token = await Tokens.create({
      user_id: user.id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    console.log(token.token);
    const url = `${process.env.BASE_URL}users/${user.id}/resetpassword/${token.token}`;
    EmailSender(
      email,
      "Jelszó visszaállítása ",
      EmailResetPassword(user.name, url)
    );

    res.status(201).json({
      msg: "Egy üzenetet küldtünk a megadott e-mail címre, ",
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

export const checkResetPswLink = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { id: req.params.id, deleted: 0, verified: 1 },
    });

    if (!user) {
      return res.status(400).json({
        msg: " Érvénytelen link !  ",
      });
    }

    const token = await Tokens.findOne({
      where: {
        user_id: user.id,
        token: req.params.token,
        tokenExpires: {
          [Op.gte]: new Date(),
        },
      },
    });

    if (!token) {
      return res.status(400).json({ msg: "Érvénytelen link ! " });
    }

    res.status(200).json({ msg: " A megadott link érvényes ! " });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// admin jelszó csere
export const changeAdmiPassword = async (req, res) => {
  const { password, newpassword, confpassword } = req.body;

  // ha az új és az ismételt új jelszó nem egyezik
  if (newpassword !== confpassword)
    return res.status(400).json({ msg: "A két jelszó nem egyezik ! " });

  try {
    // lekérjük a nem törölt admin az id alapján
    const adminuser = await Users.findOne({
      where: { id: req.params.id, role: 1, deleted: 0 },
    });
    if (!adminuser) {
      return res.status(404).json({ msg: "Felhasználó nem található !" });
    }

    // egyezik-e a régi jelszó a megadottal
    const match = await argon2.verify(adminuser.password, password);

    if (!match) {
      return res.status(400).json({
        msg: "Helytelen jelszó !",
      });
    }

    // jelszó kódolása
    const hashPassword = await argon2.hash(newpassword);

    // jelszó frissítése
    await adminuser.update({
      password: hashPassword,
    });
    res.status(200).json({ msg: " Sikeres jelszó csere ! " });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// admin modosítás
export const updateAdminData = async (req, res) => {
  const {
    name = "",
    email = "",
    university = "",
    employment = "",
    job_title = "",
  } = req.body;

  const user = await Users.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
      role: 1,
    },
  });

  if (!user)
    return res.status(404).json({ msg: "Felhasználó nem található ! " });

  try {
    await user.update({
      name: name,
      email: email,
      university: university,
      employment: employment,
      job_title: job_title,
    });
    res.status(200).json({ msg: "Adatok sikeresen modosítva !" });
  } catch (error) {
    res.status(400).json({ mgs: error.message });
  }
};
