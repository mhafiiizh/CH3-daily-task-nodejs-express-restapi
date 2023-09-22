const fs = require("fs");

// Read file data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8")
);

const checkId = (req, res, next, val) => {
  const tour = tours.find((el) => el.id === val * 1);

  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: `Data with ID = ${val} is not found`,
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "failed",
      message: `name or price are required`,
    });
  }
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    data: {
      tours,
    },
  });
};

const getToursById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const createDataTours = (req, res) => {
  // Generate ID baru
  const newId = tours[tours.length - 1].id + 1;
  const newData = Object.assign({ id: newId }, req.body);
  tours.push(newData);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // 201 = Created
      res.status(201).json({
        status: "success",
        data: {
          tours: newData,
        },
      });
    }
  );
};

const patchDataTours = (req, res) => {
  const id = req.params.id * 1;
  const tourIndex = tours.findIndex((el) => el.id === id);

  tours[tourIndex] = { ...tours[tourIndex], ...req.body };
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `Tour with ID = ${id} is edited`,
        data: {
          tours: tours[tourIndex],
        },
      });
    }
  );
};

const deleteDataTours = (req, res) => {
  // Mencari ID dan mengonversi dari String ke Numbers
  const id = req.params.id * 1;
  //   Mencari index ID
  //   If ID not found return -1
  const tourIndex = tours.findIndex((el) => el.id === id);

  // Hapus data sesuai array
  tours.splice(tourIndex, 1);
  //   Proses update di file JSON
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `Tour with ID = ${id} is deleted`,
        data: null,
      });
    }
  );
};

module.exports = {
  getAllTours,
  getToursById,
  createDataTours,
  patchDataTours,
  deleteDataTours,
  checkId,
  checkBody,
};
