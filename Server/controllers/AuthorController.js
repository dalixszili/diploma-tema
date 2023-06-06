import { Authors } from "../models/associations/ProjectAssociations.js";

// Szerző regisztrálása az adatbázisban
export const createAuthor = async (req, res) => {
  const { name, email, university, department, profile, year } = req.body;
  // Megnézzük, hogy van-e már a megadott e-mail címmel rendelkező szerző reisztrálva
  // const existingauthor = await Authors.findOne({
  //   where: {
  //     email: email,
  //   },
  // });
  //   Ha nincs akkor most regisztráljuk
  // if (!existingauthor) {
  try {
    await Authors.create({
      name: name,
      email: email,
      university: university,
      department: department,
      profile: profile,
      year: year,
    });
    res.status(200).json({ msg: "Szerző sikeresen hozzáadva !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
  // } else {
  //   // Máskülönben, ha törölve volt, akkor visszaállítjuk aktivra
  //   if (existingauthor.deleted === 1) {
  //     try {
  //       await Authors.update(
  //         {
  //           deleted: 0,
  //         },
  //         {
  //           where: {
  //             id: existingauthor.id,
  //           },
  //         }
  //       );
  //       res.status(200).json({ msg: "Szerző sikeresen hozzáadva !" });
  //     } catch (error) {
  //       res.status(500).json({ msg: error.message });
  //     }
  //   } else {
  //     // Ha nem volt törölve, akkor OK(200) státusszal térünk vissza
  //     return res.status(200).json({ msg: "Szerző sikeresen hozzáadva !" });
  //   }
  // }
};

export const getAuthorById = async (req, res) => {
  try {
    const response = await Authors.findOne({
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

export const updateAuthor = async (req, res) => {
  const { name, email, university, department, profile, year } = req.body;

  const author = await Authors.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!author)
    return res.status(404).json({ msg: "A szerző nem található ! " });

  try {
    await Authors.update(
      {
        name: name,
        email: email,
        university: university,
        department: department,
        profile: profile,
        year: year,
      },
      { where: { id: author.id } }
    );
    res.status(200).json({ msg: "Szerző sikeresen frissítve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteAuthor = async (req, res) => {
  const author = await Authors.findOne({
    where: {
      id: req.params.id,
      deleted: 0,
    },
  });
  if (!author)
    return res.status(404).json({ msg: "A szerző nem található ! " });

  try {
    await Authors.update(
      {
        deleted: 1,
      },
      { where: { id: author.id } }
    );
    res.status(200).json({ msg: "Szerző sikeresen törölve !" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
