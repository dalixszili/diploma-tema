import { Categories } from "../models/associations/ProjectAssociations.js";

// Összes szakosztály lekérése
export const getCategories = async (req, res) => {
  try {
    const response = await Categories.findAll({
      where: {
        deleted: 0,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Egy szakosztály lekérése
export const getCategoryById = async (req, res) => {
  try {
    const response = await Categories.findOne({
      where: {
        id: req.params.id,
        deleted: 0,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "A szakosztály nem található !" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Új szakosztály létrehozása
export const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    await Categories.create({
      name: name,
    });
    res.status(200).json({ msg: "Szakosztály sikeresn létrehozva !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Szakosztály frissítése
export const updateCategory = async (req, res) => {
  const category = await Categories.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!category)
    return res
      .status(404)
      .json({ msg: "A kiválasztott szakosztály nem található !" });

  const { name } = req.body;

  try {
    await Categories.update(
      {
        name: name,
      },
      {
        where: {
          id: category.id,
        },
      }
    );
    res.status(200).json({ msg: "Szakosztály sikeresn frissítve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Szakosztály törlése
export const deleteCategory = async (req, res) => {
  const category = await Categories.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!category)
    return res
      .status(404)
      .json({ msg: "A kiválasztott szakosztály már törölve van !" });

  try {
    await Categories.update(
      {
        deleted: 1,
      },
      {
        where: {
          id: category.id,
        },
      }
    );
    res.status(200).json({ msg: "Szakosztály sikeresn törölve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
