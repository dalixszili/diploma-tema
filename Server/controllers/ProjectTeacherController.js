import ProjectTeachers from "../models/ProjectTeacherModel.js";

export const addTeacherToProject = async (req, res) => {
  const { project_id, teacher_id } = req.body;
  try {
    const response = await ProjectTeachers.create({
      project_id: project_id,
      teacher_id: teacher_id,
    });

    res.status(200).json({
      msg: "Vezetőtanár sikeresen hozzáadva a projekthez sikeresen hozzáadva !",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const confirmTeacherProject = async (req, res) => {
  const { project_id, teacher_id } = req.body;
  const teacherproject = ProjectTeachers.findOne({
    where: {
      project_id: project_id,
      teacher_id: teacher_id,
    },
  });
  if (!teacherproject)
    return res.status(404).json({ msg: "A projekt nem található! " });
  try {
    await ProjectTeachers.update({
      confirm: 1,
    });

    res.status(200).json({
      msg: "Vezetőtanár sikeresen hozzáadva a projekthez sikeresen hozzáadva !",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
