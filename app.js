//  CORE PACKAGE MODULE
const http = require("http");
const fs = require("fs");

// LOCAL MODULE

// THIRD PARTY MODULE
const express = require("express");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");
const app = express();

// Middleware express
// Memodifikasi
app.use(express.json());
app.use(morgan("dev"));

// LOCAL MIDDLEWARE
app.use((req, res, next) => {
  console.log("Halo ini middleware yang kita buat");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const port = process.env.port || 3000;

// Read File From JSON
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`, "utf-8")
);

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
};

const createDataTours = (req, res) => {
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
};

const patchDataTours = (req, res) => {
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
};

const deleteDataTours = (req, res) => {
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

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: `Data with ID = ${_id} is not found`,
    });
  }

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
    `${__dirname}/dev-data/data/users.json`,
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

  if (userIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `Data with ID = ${_id} is not found`,
    });
  }

  users[userIndex] = { ...users[userIndex], ...req.body };
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
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

  //   Validasi ID
  if (userIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `Data with ID = ${_id} is not found`,
    });
  }
  // Hapus data sesuai array
  users.splice(userIndex, 1);
  //   Proses update di file JSON
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
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

// Routing
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getToursById);
// app.post("/api/v1/tours", createDataTours);
// app.patch("/api/v1/tours/:id", patchDataTours);
// app.delete("/api/v1/tours/:id", deleteDataTours);

// app.route("/api/v1/tours").get(getAllTours).post(createDataTours);
// app
//   .route("/api/v1/tours/:id")
//   .get(getToursById)
//   .patch(patchDataTours)
//   .delete(deleteDataTours);

const tourRouter = express.Router();
const userRouter = express.Router();

// ROUTES UNTUK TOUERS
tourRouter.route("/").get(getAllTours).post(createDataTours);

tourRouter
  .route("/:id")
  .get(getToursById)
  .patch(patchDataTours)
  .delete(deleteDataTours);

// ROUTES UNTUK USERS
userRouter.route("/").get(getAllUsers).post(createDataUsers);

userRouter
  .route("/:_id")
  .get(getUsersById)
  .patch(patchDataUsers)
  .delete(deleteDataUsers);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
