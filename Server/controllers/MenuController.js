import { Menus, Pages } from "../models/associations/MenuPageAssociations.js";
import { Sequelize } from "sequelize";
const Op = Sequelize.Op;

// Menü lekérése megjelenési sorrend szerint
export const getMenusByOrder = async (req, res) => {
  try {
    const response = await Menus.findAll({
      where: {
        deleted: 0,
      },
      order: [["order_num", "ASC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Menü és oldal lekérése megjelenési sorrend szerint
export const getMenusByOrderWithPages = async (req, res) => {
  try {
    const response = await Menus.findAll({
      where: {
        deleted: 0,
      },
      order: [["order_num", "ASC"]],
      include: [
        {
          model: Pages,
          as: "page",
          where: {
            deleted: 0,
          },
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Egy menü adatainak lekérése
export const getMenuById = async (req, res) => {
  try {
    const response = await Menus.findOne({
      where: {
        id: req.params.id,
        deleted: 0,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "A menü nem található !" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Új menÜ hozzáadása
export const createMenu = async (req, res) => {
  const count = await Menus.count();
  const { name, page_id } = req.body;
  try {
    await Menus.create({
      name: name,
      page_id: page_id,
      order_num: count + 1,
    });
    res.status(200).json({ msg: "Menü sikeresen hozzáadva !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Egy menü szerkesztése
export const updateMenu = async (req, res) => {
  // A kiválasztott menü megtalálása
  const menuitem = await Menus.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!menuitem) return res.status(404).json({ msg: "Menü nem található !" });
  const { name = menuitem.name, page_id = menuiten.page_id } = req.body;

  // A kiválasztott menü adatainak frissitése
  try {
    await Menus.update(
      {
        name: name,
        page_id: page_id,
      },
      {
        where: {
          id: menuitem.id,
        },
      }
    );
    res.status(200).json({ msg: "Menü sikeresen frissítve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Egy menü törlése
export const deleteMenu = async (req, res) => {
  // A kiválasztott menü megtalálása
  const menuitem = await Menus.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!menuitem) return res.status(404).json({ msg: "Menü nem található !" });

  // A kiválasztott menü adatainak frissitése
  try {
    await Menus.update(
      {
        deleted: 1,
      },
      {
        where: {
          id: menuitem.id,
        },
      }
    );
    res.status(200).json({ msg: "Menü sikeresen törölve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Menü előbbre vagy hátrébb helyezése a megjelenítési listában
export const setMenuOrderById = async (req, res) => {
  // Aktuális menü megkeresése
  const menuitem = await Menus.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!menuitem) return res.status(404).json({ msg: "Menü nem található !" });
  const { arrow = 1 } = req.body;

  // Abban az esetben ha előbre szeretnénk helyezni
  if (arrow === 1) {
    // Első menü megtalálása
    const menufirst = await Menus.findOne({
      where: {
        deleted: 0,
      },
      order: [["order_num", "ASC"]],
    });
    // Ha már első helyen van a kiválasztott menü
    if (menuitem.order_num === menufirst.order_num)
      return res
        .status(400)
        .json({ msg: "A kiválasztott menü már az első helyen van !" });
    // A sorban elötte lévő adatainak lekérése
    const menubefore = await Menus.findOne({
      where: {
        deleted: 0,
        order_num: { [Op.lt]: menuitem.order_num },
      },
      order: [["order_num", "DESC"]],
    });
    const menuorder = menuitem.order_num;
    const menubeforeorder = menubefore.order_num;
    // A kiválasztott és az előtte lévő menü sorrendjének megcserélése
    // Menük tábla frissitése
    try {
      await Menus.update(
        {
          order_num: menubeforeorder,
        },
        {
          where: {
            id: menuitem.id,
          },
        }
      );
      await Menus.update(
        {
          order_num: menuorder,
        },
        {
          where: {
            id: menubefore.id,
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
    // UtolsÓ menü megtalálása
    const menulast = await Menus.findOne({
      where: {
        deleted: 0,
      },
      order: [["order_num", "DESC"]],
    });
    // Ha már utolsó helyen van a kiválasztott menü
    if (menuitem.order_num === menulast.order_num)
      return res
        .status(400)
        .json({ msg: "A kiválasztott menü már az utolsó helyen van !" });
    // A sorban utána lévő adatainak lekérése
    const menuafter = await Menus.findOne({
      where: {
        deleted: 0,
        order_num: { [Op.gt]: menuitem.order_num },
      },
      order: [["order_num", "ASC"]],
    });
    const menuorder = menuitem.order_num;
    const menuafterorder = menuafter.order_num;
    // A kiválasztott és az utána lévő menü sorrendjének megcserélése
    // Menük tábla frissitése
    try {
      await Menus.update(
        {
          order_num: menuafterorder,
        },
        {
          where: {
            id: menuitem.id,
          },
        }
      );
      await Menus.update(
        {
          order_num: menuorder,
        },
        {
          where: {
            id: menuafter.id,
          },
        }
      );
      res.status(200).json({ msg: "A sorrend sikeresen megváltoztatva !" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
};
