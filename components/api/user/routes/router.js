const userController = require("./../controller/userController");
const questionController = require("./../controller/questionController");
const commonController = require("./../controller/commonController");
const agendaController = require("./../controller/agendaController");
const { check } = require("express-validator");
const token = require("./../../../../utilities/verify_token");
const multer = require("multer");

const DIR = "./public/uploads";
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

let upload = multer({ storage: storage });

module.exports = (router) => {
  //Admin  Routes
  //router.get('/login',loginController.login);

  router.post(
    "/api/login",
    [
      check("email").not().isEmpty().withMessage("Email field is required"),
      check("password")
        .not()
        .isEmpty()
        .withMessage("Password field is required"),
    ],
    userController.login
  );
  router.post("/api/user/create", userController.createUser);

  router.get("/api/questions/:id", questionController.getQuestion);
  router.post(
    "/api/user/step-one",
    token.verifyToken,
    userController.updateStep_one
  );
  router.post(
    "/api/user/step-two",
    token.verifyToken,
    userController.updateStep_two
  );
  router.post(
    "/api/user/step-three",
    token.verifyToken,
    userController.updateStep_three
  );
  router.post(
    "/api/upload",
    upload.single("image"),
    userController.imageUpload
  );
  router.post("/api/add-time", userController.addtime);

  router.get("/api/timezones", commonController.getAllTimezones);
  router.post("/api/agendas/dates", agendaController.getAgendaDates);
  router.post("/api/agendas/databy-date", agendaController.getAgendasByDate);
  router.post("/api/agendas/databy-id", agendaController.getAgendasById);
  router.post(
    "/api/agendas/add-as-favourite",
    token.verifyToken,
    agendaController.addAgendaAsFavourite
  );
  router.post(
    "/api/agendas/participant_count",
    token.verifyToken,
    agendaController.countAgendaParticipants
  );
  router.post(
    "/api/agendas/participants_count",
    token.verifyToken,
    agendaController.getAgendaParticipantsCount
  );
  router.get("/api/designation", commonController.getAllDesignation);
};
