import {
  Projects,
  Categories,
  Authors,
} from "../models/associations/ProjectAssociations.js";

// Összes projekt és hozzá tartozó adatok lekérése
export const getProjects = async (req, res) => {
  try {
    const respone = await Projects.findAll({
      where: { deleted: 0 },

      include: [
        {
          model: Categories,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Authors,
          as: "authors",
          attributes: [
            "id",
            "name",
            "email",
            "university",
            "department",
            "profile",
            "year",
          ],
        },
        // { model: Users, as: "user", attributes: ["id", "name", "email"] },
      ],
    });
    res.status(200).json(respone);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Új projekt létrehozása
export const createProject = async (req, res) => {
  const { title, abstract, project_file, keywords, category_id, user_id } =
    req.body;
  try {
    const response = await Projects.create({
      title: title,
      abstract: abstract,
      project_file: project_file,
      keywords: keywords,
      category_id: category_id,
      user_id: user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const id = response.id;
    res.status(200).json({ msg: "Projekt sikeresen hozzáadva !", id });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Létező projekt modósítása
export const updateProject = async (req, res) => {
  const project = await Projects.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!project)
    return res.status(404).json({ msg: "A projekt nem található! " });
  const { title, abstract, project_file, keywords, category_id, user_id } =
    req.body;

  try {
    await Projects.update(
      {
        title: title,
        abstract: abstract,
        project_file: project_file,
        keywords: keywords,
        category_id: category_id,
        user_id: user_id,
        updated_at: new Date(),
      },
      {
        where: {
          id: project.id,
        },
      }
    );
    res.status(200).json({ msg: "A projekt sikeresen frissítve !" });
  } catch (error) {
    res.status(400).json({ mgs: error.message });
  }
};
