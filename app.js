//  CORE PACKAGE MODULE
const http = require("http");
const fs = require("fs");

// LOCAL MODULE

// THIRD PARTY MODULE
const express = require("express");
const app = express();

// Middleware express
// Memodifikasi
app.use(express.json());

const port = process.env.port || 3000;

// Read File From JSON
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8")
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tours,
    },
  });
});

app.get("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: `Data with ID = ${id} is not found`,
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  // Generate ID baru
  const newId = tours[tours.length - 1].id + 1;
  const newData = Object.assign({ id: newId }, req.body);
  tours.push(newData);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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
});

app.patch("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;
  const tourIndex = tours.findIndex((el) => el.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `Data with ID = ${id} is not found`,
    });
  }

  tours[tourIndex] = { ...tours[tourIndex], ...req.body };
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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
});

app.delete("/api/v1/tours/:id", (req, res) => {
  // Mencari ID dan mengonversi dari String ke Numbers
  const id = req.params.id * 1;
  //   Mencari index ID
  //   If ID not found return -1
  const tourIndex = tours.findIndex((el) => el.id === id);

  //   Validasi ID
  if (tourIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `Data with ID = ${id} is not found`,
    });
  }
  // Hapus data sesuai array
  tours.splice(tourIndex, 1);
  //   Proses update di file JSON
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `Tour with ID = ${id} is deleted`,
        data: null,
      });
    }
  );
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
