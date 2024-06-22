import Authors from "../models/AuthorModel.js";
import ProjectAuthors from "../models/ProjectAuthorModel.js";
import Projects from "../models/ProjectModel.js";

export const addAuthorToProject = async (req, res) => {
  const { project_id, author_id } = req.body;

  const author = await Authors.findOne({
    where: {
      deleted: 0,
      id: author_id,
    },
  });

  if (!author) {
    return res.status(404).json({ msg: "Szerző nem található !" });
  }

  const project = await Projects.findOne({
    where: {
      deleted: 0,
      id: project_id,
    },
  });

  if (!project) {
    return res.status(404).json({ msg: "Projekt nem található !" });
  }

  try {
    await ProjectAuthors.create({
      project_id: project_id,
      author_id: author_id,
    });

    res.status(200).json({
      msg: "Szerző sikeresen hozzáadva a projekthez !",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteAuthor = async (req, res) => {
  const { project_id, author_id } = req.body;

  const author = await Authors.findOne({
    where: {
      deleted: 0,
      id: author_id,
    },
  });

  if (!author) {
    return res.status(404).json({ msg: "Szerző nem található !" });
  }

  const project = await Projects.findOne({
    where: {
      deleted: 0,
      id: project_id,
    },
  });

  if (!project) {
    return res.status(404).json({ msg: "Projekt nem található !" });
  }

  try {
    await ProjectAuthors.update(
      {
        delete: 1,
      },
      {
        where: {
          project_id: project_id,
          author_id: author_id,
        },
      }
    );

    await Authors.update(
      { deleted: 1 },
      {
        where: {
          deleted: 0,
          id: author_id,
        },
      }
    );

    res.status(200).json({
      msg: "Szerző sikeresen törölve !",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
