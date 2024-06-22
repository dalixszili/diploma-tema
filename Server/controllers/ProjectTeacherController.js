import {
  Projects,
  Teachers,
} from "../models/associations/ProjectAssociations.js";
import ProjectTeachers from "../models/ProjectTeacherModel.js";
// import Teachers from "../models/TeacherModel.js";

export const addTeacherToProject = async (req, res) => {
  const { project_id, teacher_id } = req.body;

  const teacher = await Teachers.findOne({
    where: {
      deleted: 0,
      id: teacher_id,
    },
  });

  if (!teacher) {
    return res.status(404).json({ msg: "Tanár nem található !" });
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
    await ProjectTeachers.create({
      project_id: project_id,
      teacher_id: teacher_id,
    });

    res.status(200).json({
      msg: "Vezetőtanár sikeresen hozzáadva a projekthez !",
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

export const deleteTeacher = async (req, res) => {
  const { project_id, teacher_id } = req.body;
  const teacher = await Teachers.findOne({
    where: {
      deleted: 0,
      id: teacher_id,
    },
  });

  if (!teacher) {
    return res.status(404).json({ msg: "Tanár nem található !" });
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
    await ProjectTeachers.update(
      { deleted: 1 },
      {
        where: {
          project_id: project_id,
          teacher_id: teacher_id,
        },
      }
    );

    await Teachers.update(
      { deleted: 1 },
      {
        where: {
          deleted: 0,
          id: teacher_id,
        },
      }
    );

    res.status(200).json({
      msg: "Vezetőtanár sikeresen törölve !",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
