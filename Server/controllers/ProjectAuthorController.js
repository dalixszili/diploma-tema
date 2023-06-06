import ProjectAuthors from "../models/ProjectAuthorModel.js";

export const addAuthorToProject = async (req, res) => {
  const { project_id, author_id } = req.body;
  try {
    const response = await ProjectAuthors.create({
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
