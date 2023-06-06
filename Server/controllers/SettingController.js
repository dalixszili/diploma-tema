import Settings from "../models/SettingModel.js";

export const getSettings = async (req, res) => {
  try {
    const response = await Settings.findAll({
      where: {
        deleted: 0,
      },
      order: [
        ["is_active", "DESC"],
        ["curr_year", "DESC"],
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getActiveYear = async (req, res) => {
  try {
    const response = await Settings.findOne({
      where: {
        deleted: 0,
        is_active: 1,
      },
      attributes: ["year"],
    });
    if (!response) {
      return res.status(404).json({ msg: "Az év nem található !" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSettingsByActiveYear = async (req, res) => {
  try {
    const response = await Settings.findOne({
      where: {
        deleted: 0,
        is_active: 1,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "A beállítások nem találhatóak !" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSettingsById = async (req, res) => {
  try {
    const response = await Settings.findOne({
      where: {
        deleted: 0,
        id: req.params.id,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "A beállítások nem találhatóak !" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createSettings = async (req, res) => {
  const {
    website_title,
    registration_date,
    abstract_date,
    project_date,
    curr_year,
  } = req.body;
  try {
    await Settings.create({
      website_title: website_title,
      registration_date: registration_date,
      abstract_date: abstract_date,
      project_date: project_date,
      curr_year: curr_year,
    });
    res.status(200).json({ msg: "Beállítások sikeresen hozzáadva !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateSettings = async (req, res) => {
  const setting = await Settings.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!setting)
    return res.status(404).json({ msg: "Beállítások nem található !" });
  const {
    website_title,
    registration_date,
    abstract_date,
    project_date,
    curr_year,
  } = req.body;
  try {
    await Settings.update(
      {
        website_title: website_title,
        registration_date: registration_date,
        abstract_date: abstract_date,
        project_date: project_date,
        curr_year: curr_year,
      },
      {
        where: {
          id: setting.id,
        },
      }
    );
    res.status(200).json({ msg: "Beállítások sikeresen frissítve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteSettings = async (req, res) => {
  const setting = await Settings.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
      is_active: 0,
    },
  });
  if (!setting)
    return res.status(404).json({ msg: "Beállítások nem található !" });

  try {
    await Settings.update(
      {
        deleted: 1,
      },
      {
        where: {
          id: setting.id,
        },
      }
    );
    res.status(200).json({ msg: "Beállítások sikeresen törölve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const setActiveById = async (req, res) => {
  const setting = await Settings.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
      is_active: 0,
    },
  });
  const activesetting = await Settings.findOne({
    where: {
      deleted: 0,
      is_active: 1,
    },
  });

  if (!setting)
    return res
      .status(404)
      .json({ msg: "Beállítás nem található, vagy már aktiv !" });

  try {
    await Settings.update(
      {
        is_active: 1,
      },
      {
        where: {
          id: setting.id,
        },
      }
    );
    await Settings.update(
      {
        is_active: 0,
      },
      {
        where: {
          id: activesetting.id,
        },
      }
    );
    res.status(200).json({ msg: "Aktiv Beállítások sikeresen beállítva !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
