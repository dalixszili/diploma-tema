import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import {
  Projects,
  Categories,
  Authors,
  Teachers,
} from "../models/associations/ProjectAssociations.js";
import { JudgeCategory } from "../models/associations/JudgeCategoryAssociation.js";

// Összes projekt és hozzá tartozó adatok lekérése
export const getProjects = async (req, res) => {
  try {
    const respone = await Projects.findAll({
      where: { deleted: 0 },

      include: [
        {
          model: Categories,
          as: "category",
          where: { deleted: 0 },
          attributes: ["id", "name"],
        },
        {
          model: Authors,
          as: "authors",
          where: { deleted: 0 },
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
        {
          model: Teachers,
          as: "teachers",
          where: { deleted: 0 },
          attributes: ["id", "name", "email", "employment", "job_title"],
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
  const { title, category_id, user_id } = req.body;
  try {
    const resp_id = await Projects.create({
      title: title,
      category_id: category_id,
      user_id: user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const project = await Projects.findOne({
      where: { deleted: 0, id: resp_id.id },

      include: [
        {
          model: Categories,
          as: "category",
          where: { deleted: 0 },
          required: false,
          attributes: ["id", "name"],
        },
        {
          model: Authors,
          as: "authors",
          where: { deleted: 0 },
          required: false,
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
        {
          model: Teachers,
          as: "teachers",
          where: { deleted: 0 },
          required: false,
          attributes: ["id", "name", "email", "employment", "job_title"],
        },
        // { model: Users, as: "user", attributes: ["id", "name", "email"] },
      ],
    });

    // const id = response.id;
    res.status(200).json({ msg: "Projekt sikeresen hozzáadva !", project });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Létező projekt modósítása
export const updateProject = async (req, res) => {
  const project = await Projects.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
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
    res.status(500).json({ mgs: error.message });
  }
};

// Projekt absztrakt módosítása
export const updateProjectAbstract = async (req, res) => {
  const project = await Projects.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!project)
    return res.status(404).json({ msg: "A projekt nem található! " });

  const { abstract } = req.body;

  try {
    await Projects.update(
      {
        abstract: abstract,
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
    res.status(500).json({ mgs: error.message });
  }
};

// Projekt cím módosítása
export const updateProjectTitle = async (req, res) => {
  const project = await Projects.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!project)
    return res.status(404).json({ msg: "A projekt nem található! " });

  const { title } = req.body;

  try {
    await Projects.update(
      {
        title: title,
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
    res.status(500).json({ mgs: error.message });
  }
};

// Felhasznaló projektel lekérdezése
export const getUserProjects = async (req, res) => {
  try {
    const respone = await Projects.findAll({
      where: { deleted: 0, user_id: req.params.id },

      include: [
        {
          model: Categories,
          as: "category",
          where: { deleted: 0 },
          required: false,
          attributes: ["id", "name"],
        },
        {
          model: Authors,
          as: "authors",
          where: { deleted: 0 },
          required: false,
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
        {
          model: Teachers,
          as: "teachers",
          where: { deleted: 0 },
          required: false,
          attributes: ["id", "name", "email", "employment", "job_title"],
        },
        // { model: Users, as: "user", attributes: ["id", "name", "email"] },
      ],
    });
    res.status(200).json(respone);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Projek lekérdezése id szerint
export const getProjectById = async (req, res) => {
  try {
    const respone = await Projects.findOne({
      where: { deleted: 0, id: req.params.id },

      include: [
        {
          model: Categories,
          as: "category",
          where: { deleted: 0 },
          required: false,
          attributes: ["id", "name"],
        },
        {
          model: Authors,
          as: "authors",
          where: { deleted: 0 },
          required: false,
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
        {
          model: Teachers,
          as: "teachers",
          where: { deleted: 0 },
          required: false,
          attributes: ["id", "name", "email", "employment", "job_title"],
        },
        // { model: Users, as: "user", attributes: ["id", "name", "email"] },
      ],
    });
    res.status(200).json(respone);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Létező projekt törlése
export const deleteProject = async (req, res) => {
  const project = await Projects.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!project)
    return res.status(404).json({ msg: "A projekt nem található! " });
  try {
    await Projects.update(
      {
        deleted: 1,
      },
      {
        where: {
          id: project.id,
        },
      }
    );
    res.status(200).json({ msg: "A projekt sikeresen törölve !" });
  } catch (error) {
    res.status(500).json({ mgs: error.message });
  }
};

//Fajl mentes
export const saveProjectFile = async (req, res) => {
  const project_id = req.params.id;

  const project_file = await req.file.filename;
  const original_filename = await req.file.originalname;

  // console.log("Regular:  " + original_filename);
  // console.log("NFC:      " + uniform.nfc(original_filename));
  // console.log("NFD:      " + uniform.nfd(original_filename));
  // console.log("NFKC:     " + uniform.nfkc(original_filename));
  // console.log('NFKD: *   ' + original_filename.nfkd(text).replace(original_filename, ''));

  const project = await Projects.findOne({
    where: {
      deleted: 0,
      id: project_id,
    },
  });

  if (!project) {
    return res.status(404).json({ msg: "A projekt nem található !" });
  }

  const filepath = dirname(fileURLToPath(import.meta.url)).split("\\");
  // .splice(-1.1);
  // console.log(req.file);
  filepath.length = filepath.length - 1;
  const file_to_delete =
    filepath.join("\\") + "\\public\\projects\\" + project.project_file_saved;
  console.log(file_to_delete);
  console.log(dirname(fileURLToPath(import.meta.url)));
  try {
    await Projects.update(
      {
        project_file_saved: project_file,
        project_file: original_filename,
        updated_at: new Date(),
      },
      { where: { id: project_id, deleted: 0 } }
    );

    // await fs.unlinke(file_to_delete);
    if (fs.existsSync(file_to_delete)) {
      fs.unlinkSync(file_to_delete);
    }

    res.status(200).json({ msg: "Sikeres feltöltés !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Projektek lekérése zsüri szerint
export const getJudgeProjects = async (req, res) => {
  const category_id = await JudgeCategory.findAll({
    where: {
      // deleted: 0,
      judge_id: req.params.id,
    },
  });

  // console.log(category_id.map((cat) => cat.category_id));
  // if (!category_id) {
  // return res.status(404).json({ msg: "Nem található kategória !" });
  // }

  try {
    const respone = await Projects.findAll({
      where: {
        deleted: 0,
        category_id: category_id.map((cat) => cat.category_id),
      },

      include: [
        {
          model: Categories,
          as: "category",
          // where: { deleted: 0 },
          required: false,
          attributes: ["id", "name"],
        },
        {
          model: Authors,
          as: "authors",
          where: { deleted: 0 },
          required: false,
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
        {
          model: Teachers,
          as: "teachers",
          where: { deleted: 0 },
          required: false,
          attributes: ["id", "name", "email", "employment", "job_title"],
        },
        // { model: Users, as: "user", attributes: ["id", "name", "email"] },
      ],
    });
    res.status(200).json(respone);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
