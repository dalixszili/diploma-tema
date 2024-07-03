import express from "express";
import {
  createProject,
  deleteProject,
  getJudgeProjects,
  getProjectById,
  getProjects,
  getUserProjects,
  saveProjectFile,
  updateProjectAbstract,
  updateProjectTitle,
} from "../controllers/ProjectController.js";
import {
  addAuthorToProject,
  deleteAuthor,
} from "../controllers/ProjectAuthorController.js";
import {
  addTeacherToProject,
  deleteTeacher,
} from "../controllers/ProjectTeacherController.js";
import multer from "multer";

// // Projekt mentése
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/projects");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  // fileFilter: (req, file, cb) => {
  //   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
  //     cb(null, true);
  //   } else {
  //     cb(new Error('Invalid file type'));
  //   }
  // },
});

const router = express.Router();

router.get("/projects", getProjects);
router.get("/getuserprojects/:id", getUserProjects);
router.get("/getprojectbyid/:id", getProjectById);
router.get("/getprojectbyjudgecategory/:id", getJudgeProjects);
router.post("/newproject", createProject);
router.post("/newprojectteacher", addTeacherToProject);
router.post("/newprojectauthor", addAuthorToProject);
router.post(
  "/saveprojectfile/:id",
  upload.single("project_file"),
  saveProjectFile
);
// router.patch("/updateproject/:id", updateProject);
router.patch("/updateprojectabstract/:id", updateProjectAbstract);
router.patch("/updateprojecttitle/:id", updateProjectTitle);
router.patch("/deleteprojectauthor", deleteAuthor);
router.patch("/deleteprojectteacher", deleteTeacher);
router.patch("/deleteproject/:id", deleteProject);

export default router;
