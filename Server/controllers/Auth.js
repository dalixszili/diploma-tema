import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const logIn = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found ! " });
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) {
    return res.status(400).json({ msg: "Wrong password !" });
  }
  req.session.userId = user.id;
  const id = user.id;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  res.status(200).json({ id, name, email, role });
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
  //   const university = user.university;
  //   const department = user.department;
  //   const profile = user.profile;
  //   const year = user.year;
  const role = user.role;
  //   const employment = user.employment;
  //   const job_title = user.job_title;
  res.status(200).json({ id, name, email, role });
};

export const logOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: err.message });
    res.status(200).json({ msg: "Logout successfully !" });
  });
};
