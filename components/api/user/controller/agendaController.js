var mongoose = require("mongoose");
var Agenda = require("./../../../../models/Agenda");
var Favourite = require("./../../../../models/Favourite");
var AgendaParticipant = require("./../../../../models/AgendaParticipant");
const { Validator } = require("node-input-validator");
var moment = require("moment");

const getAgendaDates = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    page: "required|integer",
    limit: "required|integer",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        var skip = formData.page * formData.limit - formData.limit;
        let start = moment().startOf("date").format("X");
        // let end = moment().endOf('date').format('X');
        await Agenda.aggregate([
          {
            $match: {
              event: new mongoose.Types.ObjectId(formData.event_id),
              agenda_date: { $gte: start },
            },
          },
          {
            $group: {
              _id: { agenda_date: "$agenda_date" },
              count: { $sum: 1 },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
          {
            $limit: formData.limit,
          },
          {
            $skip: skip,
          },
        ]).exec(function (err, agendas) {
          if (err) {
            res.json({ status: 404, message: "No data found.", data: "" });
          } else {
            res.json({
              status: 200,
              message: "agenda dates",
              agendas: agendas,
              page: formData.page,
              total: agendas.length,
            });
          }
        });
      } catch (db_error) {
        console.log("db_error ------>", db_error);
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const getAgendasByDate = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    date: "required|dateFormat:DD-MM-YYYY",
    page: "required|integer",
    limit: "required|integer",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        var skip = formData.page * formData.limit - formData.limit;
        var date = moment(formData.date + "00:00", "DD/MM/YYYY HH:mm").format(
          "X"
        );
        //var end = moment(formData.date + "23:59", "DD/MM/YYYY HH:mm").format('X');

        console.log("start ------------------>", date);
        //console.log("end   ------------------>", end);

        /*await Agenda.find({
                    event: formData.event_id,
                    agenda_date: {
                        $eq: date
                    }
                }).populate('agenda_category')
                    .skip(skip)
                    .limit(formData.limit)
                */

        await Agenda.aggregate([
          {
            $match: {
              event: new mongoose.Types.ObjectId(formData.event_id),
              agenda_date: { $eq: date },
            },
          },
          {
            $lookup: {
              from: "agenda_categories",
              localField: "agenda_category",
              foreignField: "_id",
              as: "agenda_categories",
            },
          },
          {
            $limit: formData.limit,
          },
          {
            $skip: skip,
          },
        ]).exec(async function (err, agendas) {
          if (err) {
            res.json({ status: 404, message: "No data found.", data: "" });
          } else {
            res.json({
              status: 200,
              message: "agenda data all",
              agendas: agendas,
              page: formData.page,
              total: agendas.length,
            });
          }
        });
      } catch (db_error) {
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const getAgendasById = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    agenda_id: "required|string",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        Agenda.find({
          event: formData.event_id,
          _id: formData.agenda_id,
        })
          .populate("agenda_category")
          .exec(async function (err, agenda) {
            if (err) {
              res.json({ status: 404, message: "No data found.", data: {} });
            } else {
              res.json({
                status: 200,
                message: "Agenda fetched Successful",
                data: agenda,
              });
            }
          });
      } catch (db_error) {
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const addAgendaAsFavourite = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    agenda_id: "required|string",
    user_id: "required|string",
    status: "required|boolean",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        var findFavourite = await Favourite.find({
          event: formData.event_id,
          agenda: formData.agenda_id,
          user_id: formData.user_id,
        }).exec();

        if (findFavourite.length > 0) {
          var update = {
            event: formData.event_id,
            agenda: formData.agenda_id,
            user_id: formData.user_id,
            status: formData.status,
          };

          await Favourite.updateOne(update, function (err, result) {
            if (err) {
              res.json({ status: 400, message: err });
            } else {
              res.json({
                status: 200,
                message: "agenda added as favourite.",
                data: result,
              });
            }
          });
        } else {
          const AddFavourite = new Favourite({
            event: formData.event_id,
            agenda: formData.agenda_id,
            user_id: formData.user_id,
            status: formData.status,
          });
          await AddFavourite.save()
            .then((data) => {
              res.json({
                status: 200,
                message: "agenda added as favourite.",
                data: data,
              });
            })
            .catch((err) => {
              res.json({ status: 400, message: err });
            });
        }
      } catch (db_error) {
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const getMyAgendas = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    date: "required|dateFormat:DD-MM-YYYY",
    page: "required|integer",
    limit: "required|integer",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        var skip = formData.page * formData.limit - formData.limit;
        var start = moment(
          formData.date + " 00:00",
          "DD/MM/YYYY HH:mm"
        ).valueOf();
        var end = moment(
          formData.date + " 23:59",
          "DD/MM/YYYY HH:mm"
        ).valueOf();
        Agenda.find({
          event: formData.event_id,
          agenda_date: {
            $gte: moment(start).format("x"),
            $lt: moment(end).format("x"),
          },
        })
          .populate("agenda_category", "timezones")
          .skip(skip)
          .limit(formData.limit)
          .exec(async function (err, agendas) {
            if (err) {
              res.json({ status: 404, message: "No data found.", data: "" });
            } else {
              let total = await Agenda.countDocuments().exec();
              res.json({
                status: 200,
                message: "agenda data",
                agendas: agendas,
                page: formData.page,
                total: total,
              });
            }
          });
      } catch (db_error) {
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const countAgendaParticipants = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    agenda_id: "required|string",
    action: "required|string",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        console.log("try ----> ");
        var data = await AgendaParticipant.find({
          event_id: formData.event_id,
          agenda_id: formData.agenda_id,
        }).exec();
        console.log("data ----> ", data);
        if (data.length > 0) {
          var no_of_participant =
            formData.action === "increment"
              ? data[0].number_of_participant + 1
              : data[0].number_of_participant - 1;
          var update_data = {
            event_id: formData.event_id,
            agenda_id: formData.agenda_id,
            number_of_participant:
              no_of_participant < 0 ? 0 : no_of_participant,
          };

          await AgendaParticipant.updateOne(update_data, function (
            err,
            result
          ) {
            if (err) {
              res.json({ status: 400, message: err });
            } else {
              res.json({
                status: 200,
                message: "participant added.",
                result: result,
              });
            }
          });
        } else {
          const ParticipantCount = new AgendaParticipant({
            event_id: formData.event_id,
            agenda_id: formData.agenda_id,
            number_of_participant: 1,
          });

          await ParticipantCount.save()
            .then((data) => {
              console.log("data ---->", data);
            })
            .catch((err) => {
              console.log("err 2", err);
            });
        }
      } catch (db_error) {
        console.log("db_error ----->", db_error);
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const getAgendaParticipantsCount = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    agenda_id: "required|string",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        AgendaParticipant.find({
          event_id: formData.event_id,
          agenda_id: formData.agenda_id,
        })
          .select("number_of_participant")
          .exec(function (err, AgendaParticipantCount) {
            if (err) {
              res.json({ status: 404, message: "No data found.", data: {} });
            } else {
              res.json({
                status: 200,
                message: "Agenda Participant Count",
                data: AgendaParticipantCount[0],
              });
            }
          });
      } catch (db_error) {
        console.log("db_error ----->", db_error);
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

module.exports = {
  getAgendaDates,
  getAgendasByDate,
  addAgendaAsFavourite,
  getMyAgendas,
  getAgendasById,
  countAgendaParticipants,
  getAgendaParticipantsCount,
};
