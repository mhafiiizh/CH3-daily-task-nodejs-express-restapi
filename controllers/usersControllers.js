const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

//  Read data file
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, "utf-8")
);

const checkId = (req, res, next, val) => {
  const user = users.find((el) => el._id === _id);

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: `Data with ID = ${_id} is not found`,
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({
      status: "failed",
      message: `name or price are required`,
    });
  }
  next();
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    data: {
      users,
    },
  });
};

const getUsersById = (req, res) => {
  const _id = req.params._id;
  const user = users.find((el) => el._id === _id);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

const createDataUsers = (req, res) => {
  // Generate ID baru
  const newId = uuidv4();
  const newData = Object.assign({ _id: newId }, req.body);
  users.push(newData);
  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      // 201 = Created
      res.status(201).json({
        status: "success",
        data: {
          users: newData,
        },
      });
    }
  );
};

const patchDataUsers = (req, res) => {
  const _id = req.params._id;
  const userIndex = users.findIndex((el) => el._id === _id);

  users[userIndex] = { ...users[userIndex], ...req.body };
  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `Tour with ID = ${_id} is edited`,
        data: {
          users: users[userIndex],
        },
      });
    }
  );
};

const deleteDataUsers = (req, res) => {
  // Mencari ID dan mengonversi dari String ke Numbers
  const _id = req.params._id;
  //   Mencari index ID
  //   If ID not found return -1
  const userIndex = users.findIndex((el) => el._id === _id);

  // Hapus data sesuai array
  users.splice(userIndex, 1);
  //   Proses update di file JSON
  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `Tour with ID = ${_id} is deleted`,
        data: null,
      });
    }
  );
};

module.exports = {
  getAllUsers,
  getUsersById,
  createDataUsers,
  patchDataUsers,
  deleteDataUsers,
  checkId,
  checkBody,
};
