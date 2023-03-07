import User from "../models/UserModel.js";
import argon2 from "argon2";

// Get Users
export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get User By ID
export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Create User
export const createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    confpassword,
    university,
    department,
    profile,
    year,
    role,
    employment,
    job_title,
  } = req.body;
  const data = req.body;
  if (password !== confpassword)
    return res.status(400).json({ msg: "Confirm password error ! " });

  const hashPassword = await argon2.hash(data.password);
  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
      university: university,
      department: department,
      profile: profile,
      year: year,
      role: role,
      employment: employment,
      job_title: job_title,
    });
    res.status(201).json({ msg: "User created successfully ! " });
  } catch (error) {
    res.status(400).json({ mgs: error.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found ! " });
  const {
    name = "",
    email = "",
    university = "",
    department = "",
    profile = "",
    year = 0,
    role = 2,
    employment = "",
    job_title = "",
  } = req.body;
  const data = req.body;

  try {
    await User.update(
      {
        name: name,
        email: email,
        university: university,
        department: department,
        profile: profile,
        year: year,
        role: role,
        employment: employment,
        job_title: job_title,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: "User updated successfully !" });
  } catch (error) {
    res.status(400).json({ mgs: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found ! " });

  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User deleted successfully !" });
  } catch (error) {
    res.status(400).json({ mgs: error.message });
  }
};
