import { Sequelize } from "sequelize";
import Sponsors from "../models/SponsorsModel.js";
const Op = Sequelize.Op;
import multer from "multer";

// Képek mentése
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

export const upload = multer({
  storage: storage,
});

// Szponzorok lekérése megjelenési sorrend szerint
export const getSponsorsByOrder = async (req, res) => {
  try {
    const response = await Sponsors.findAll({
      where: {
        deleted: 0,
      },
      order: [["order", "ASC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Egy szponzor adatainak lekérése
export const getSponsorById = async (req, res) => {
  try {
    const response = await Sponsors.findOne({
      where: {
        id: req.params.id,
        deleted: 0,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "A szponzor nem található !" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Új szponzor hozzáadása
export const createSponsor = async (req, res) => {
  const count = await Sponsors.count();
  const { name, website_url } = req.body;
  const logo_file = await req.file.filename;
  try {
    await Sponsors.create({
      name: name,
      website_url: website_url,
      logo_file: logo_file,
      order: count + 1,
    });
    res.status(200).json({ msg: "Szponzor sikeresen hozzáadva !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Egy szponzor szerkesztése
export const updateSponsor = async (req, res) => {
  // A kiválasztott szponzor megtalálása
  const sponsor = await Sponsors.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!sponsor)
    return res.status(404).json({ msg: "Szponzor nem található !" });
  const {
    name = sponsor.name,
    website_url = sponsor.website_url,
    order = sponsor.order,
  } = req.body;

  let logo_file = "";
  if (req.file) {
    logo_file = await req.file.filename;
  } else {
    logo_file = sponsor.filename;
  }

  // A kiválasztott szponzor adatainak frissitése
  try {
    await Sponsors.update(
      {
        name: name,
        website_url: website_url,
        logo_file: logo_file,
        order: order,
      },
      {
        where: {
          id: sponsor.id,
        },
      }
    );
    res.status(200).json({ msg: "Szponzor sikeresen frissítve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Szponzor törlése
export const deleteSponsor = async (req, res) => {
  const sponsor = await Sponsors.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!sponsor)
    return res.status(404).json({ msg: "Szponzor nem található !" });
  try {
    await Sponsors.update(
      {
        deleted: 1,
      },
      {
        where: {
          id: sponsor.id,
        },
      }
    );
    res.status(200).json({ msg: "Szponzor sikeresen törölve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Szponzor előbbre vagy hátrébb helyezése a megjelenítési listában
export const setOrderById = async (req, res) => {
  // Aktuális szponzor megkeresése
  const sponsor = await Sponsors.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!sponsor)
    return res.status(404).json({ msg: "Szponzor nem található !" });
  const { arrow = 1 } = req.body;

  // Abban az esetben ha előbre szeretnénk helyezni
  if (arrow === 1) {
    // Első szponzor megtalálása
    const sponsorfirst = await Sponsors.findOne({
      where: {
        deleted: 0,
      },
      order: [["order", "ASC"]],
    });
    // Ha már első helyen van a kiválasztott szponzor
    if (sponsor.order === sponsorfirst.order)
      return res
        .status(400)
        .json({ msg: "A kiválasztott szponzor már az első helyen van !" });
    // A sorban elötte lévő adatainak lekérése
    const sponsorbefore = await Sponsors.findOne({
      where: {
        deleted: 0,
        order: { [Op.lt]: sponsor.order },
      },
      order: [["order", "DESC"]],
    });
    const sponsororder = sponsor.order;
    const sponsbeforororder = sponsorbefore.order;
    // A kiválasztott és az előtte lévő szponzor sorrendjének megcserélése
    // Szponzorok tábla frissitése
    try {
      await Sponsors.update(
        {
          order: sponsbeforororder,
        },
        {
          where: {
            id: sponsor.id,
          },
        }
      );
      await Sponsors.update(
        {
          order: sponsororder,
        },
        {
          where: {
            id: sponsorbefore.id,
          },
        }
      );
      res.status(200).json({ msg: "A sorrend sikeresen megváltoztatva !" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
  // Abban az esetben ha hátrébb szeretnénk helyezni
  else {
    // UtolsÓ szponzor megtalálása
    const sponsorlast = await Sponsors.findOne({
      where: {
        deleted: 0,
      },
      order: [["order", "DESC"]],
    });
    // Ha már utolsó helyen van a kiválasztott szponzor
    if (sponsor.order === sponsorlast.order)
      return res
        .status(400)
        .json({ msg: "A kiválasztott szponzor már az utolsó helyen van !" });
    // A sorban utána lévő adatainak lekérése
    const sponsorafter = await Sponsors.findOne({
      where: {
        deleted: 0,
        order: { [Op.gt]: sponsor.order },
      },
      order: [["order", "ASC"]],
    });
    const sponsororder = sponsor.order;
    const sponsafterrorder = sponsorafter.order;
    // A kiválasztott és az utána lévő szponzor sorrendjének megcserélése
    // Szponzorok tábla frissitése
    try {
      await Sponsors.update(
        {
          order: sponsafterrorder,
        },
        {
          where: {
            id: sponsor.id,
          },
        }
      );
      await Sponsors.update(
        {
          order: sponsororder,
        },
        {
          where: {
            id: sponsorafter.id,
          },
        }
      );
      res.status(200).json({ msg: "A sorrend sikeresen megváltoztatva !" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
};
