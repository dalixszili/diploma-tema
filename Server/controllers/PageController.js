import { Pages } from "../models/associations/MenuPageAssociations.js";

// Összes oldal lekérése
export const getPages = async (req, res) => {
  try {
    const response = await Pages.findAll({
      where: {
        deleted: 0,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Egy oldal lekérése
export const getPageById = async (req, res) => {
  try {
    const response = await Pages.findOne({
      where: {
        id: req.params.id,
        deleted: 0,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "Az oldal nem található !" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Új oldal létrehozása
export const createPage = async (req, res) => {
  const { title, content, permalink, keywords, description } = req.body;

  try {
    await Pages.create({
      title: title,
      content: content,
      permalink: permalink,
      keywords: keywords,
      description: description,
    });
    res.status(200).json({ msg: "Oldal sikeresn létrehozva !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Oldal frissítése
export const updatePage = async (req, res) => {
  const page = await Pages.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!page)
    return res
      .status(404)
      .json({ msg: "A kiválasztott oldal nem található !" });

  const { title, content, permalink, keywords, description } = req.body;

  try {
    await Pages.update(
      {
        title: title,
        content: content,
        permalink: permalink,
        keywords: keywords,
        description: description,
      },
      {
        where: {
          id: page.id,
        },
      }
    );
    res.status(200).json({ msg: "Oldal sikeresen frissítve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Oldal törlése
export const deletePage = async (req, res) => {
  const page = await Pages.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!page)
    return res
      .status(404)
      .json({ msg: "A kiválasztott oldal nem található !" });

  try {
    await Pages.update(
      {
        deleted: 1,
      },
      {
        where: {
          id: page.id,
        },
      }
    );
    res.status(200).json({ msg: "Oldal sikeresen tÖrölve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
