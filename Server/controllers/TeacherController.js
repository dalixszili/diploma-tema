import Teachers from "../models/TeacherModel.js";

// Vezetőtanár regisztrálása az adatbázisban
export const createTeacher = async (req, res) => {
  const { name, email, employment, job_title } = req.body;
  // Megnézzük, hogy van-e már a megadott e-mail címmel rendelkező tanár reisztrálva
  // const existingteacher = await Teachers.findOne({
  //   where: {
  //     email: email,
  //   },
  // });
  //   Ha nincs akkor most regisztráljuk
  // if (!existingteacher) {
  try {
    await Teachers.create({
      name: name,
      email: email,
      employment: employment,
      job_title: job_title,
    });
    res.status(200).json({ msg: "Tanár sikeresen hozzáadva !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
  // } else {
  //   // Máskülönben, ha törölve volt, akkor visszaállítjuk aktivra
  //   if (existingteacher.deleted === 1) {
  //     try {
  //       await Teachers.update(
  //         {
  //           deleted: 0,
  //         },
  //         {
  //           where: {
  //             id: existingteacher.id,
  //           },
  //         }
  //       );
  //       res.status(200).json({ msg: "Tanár sikeresen hozzáadva !" });
  //     } catch (error) {
  //       res.status(500).json({ msg: error.message });
  //     }
  //   } else {
  //     // Ha nem volt törölve, akkor OK(200) státusszal térünk vissza
  //     return res.status(200).json({ msg: "Tanár sikeresen hozzáadva !" });
  //   }
  // }
};

// // Vezetőtanár törlése
// export const deleteTeacher = async (req, res) => {
//   const teacher = await Teachers.findOne({
//     where: {
//       id: req.params.id,
//       deleted: 0,
//     },
//   });
//   if (!teacher)
//     return res
//       .status(404)
//       .json({ msg: "A kiválasztott tanár nem található !" });

//   try {
//     await Teachers.update(
//       {
//         deleted: 1,
//       },
//       {
//         where: {
//           id: category.id,
//         },
//       }
//     );
//     res.status(200).json({ msg: "Tanár sikeresen törölve !" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

export const getTeacherById = async (req, res) => {
  try {
    const response = await Teachers.findOne({
      where: {
        id: req.params.id,
        deleted: 0,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  const { name, email, employment, job_title } = req.body;

  const teacher = await Teachers.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!teacher)
    return res.status(404).json({ msg: "A tanár nem található ! " });

  try {
    await Teachers.update(
      {
        name: name,
        email: email,
        employment: employment,
        job_title: job_title,
      },
      { where: { id: teacher.id } }
    );
    res.status(200).json({ msg: "Tanár sikeresen frissítve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  const teacher = await Teachers.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!teacher)
    return res.status(404).json({ msg: "A tanár nem található ! " });

  try {
    await Teachers.update(
      {
        deleted: 1,
      },
      { where: { id: teacher.id } }
    );
    res.status(200).json({ msg: "Tanár sikeresen törölve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
