var User = require("../../../models/User");
var Speaker = require("../../../models/Speaker");
var Agenda = require("../../../models/Agenda");
var AgendaCategory = require("../../../models/AgendaCategory");
var Timezone = require("../../../models/Timezone");
const timestamp = require("time-stamp");
created_date = timestamp.utc("YYYY-MM-DD HH:mm:ss");
const { validationResult } = require("express-validator");
var moment = require("moment");

module.exports.addAgenda = async (req, res) => {
  //console.log('req.params.event_id');
  //console.log(req.params.event_id);
  if (typeof req.flash("formdata") == "undefined") {
    var formdata = {
      agenda_type: "",
      agenda_category: "",
      agenda_date: "",
      start_time: "",
      end_time: "",
      time_zone: "",
      tags: "",
      featured: "",
      speakers: "",
      description: "",
      box_image: "",
      file_data: "",
      image_data: "",
      video_data: "",
    };
    req.flash("formdata", formdata);
  }
  var agenda_data = await AgendaCategory.find().exec();
  var timezones = await Timezone.find().exec();
  var speaker_data = await User.find({
    event: req.params.event_id,
    role: 6,
  }).exec();
  console.log("ddddddddddddddddddd");
  console.log(timezones);
  let active = "Event";
  let title = "Add Agenda";
  let right_active = "Agenda";
  let left_side = "active";

  ///console.log('data');
  //console.log(data);
  res.render("agenda/add_agenda", {
    layout: "layouts/eventLayout",
    timezones,
    active,
    agenda_data,
    title,
    right_active,
    left_side,
    formdata: req.flash("formdata"),
    event_id: req.params.event_id,
    speaker_data,
    errors: req.flash("errors"),
    reset: req.flash("reset"),
  });
};

module.exports.addAgendaPost = (req, res) => {
  var formdata = {
    event: req.params.event_id,
    agenda_type: req.body.agenda_type,
    title: req.body.title,
    agenda_category: req.body.agenda_category,
    agenda_date: req.body.agenda_date,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    time_zone: req.body.time_zone,
    featured: req.body.featured,
    tags: req.body.tags,
    speakers: req.body.speakers,
    description: req.body.description,
    box_image: req.body.box_image,
  };
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);

  let errorsData = {
    agenda_type: "",
    title: "",
    agenda_category: "",
    agenda_date: "",
    start_time: "",
    end_time: "",
    time_zone: "",
    tags: "",
    featured: "",
    speakers: "",
    description: "",
    box_image: "",
    file_data: "",
    image_data: "",
    video_data: "",
  };
  if (errors.array().length > 0) {
    errors.array().forEach((value) => {
      errorsData[value.param] = value.msg;
    });

    req.flash("errors", errorsData);
    req.flash("formdata", formdata);
    return res.redirect("/add-agenda/" + req.params.event_id);
  }
  ////////////////////////////////////////////////////////////
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }
  var str = req.body.tags;
  var string = str.split(",");
  console.log(string);
  var d = req.body.agenda_date;
  console.log("d ------>", d);
  var timeStamp = moment(d).format("X");
  console.log("d timeStamp ------>", timeStamp);
  // Create a Speaker
  const Agendas = new Agenda({
    event: req.params.event_id,
    agenda_type: req.body.agenda_type,
    title: req.body.title,
    agenda_category: req.body.agenda_category,
    agenda_date: timeStamp,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    time_zone: req.body.time_zone,
    tags: string,
    featured: req.body.featured,
    speakers: req.body.speakers,
    description: req.body.description,
    box_image: req.body.box_image,
    docs: req.body.file_data,
    images: req.body.image_data,
    videos: req.body.video_data,
    created_at: created_date,
    updated_at: created_date,
  });

  // Save Speakers in the database
  Agendas.save()
    .then((data) => {
      $message = { msg: "Agenda saved successfully!" };
      req.flash("errors", $message);
      return res.redirect("/add-agenda/" + req.params.event_id);
    })
    .catch((err) => {
      console.log(err);
      $message = { message: "Some error occurred!" };
      req.flash("formdata", formdata);
      req.flash("errors", $err);
      return res.redirect("/add-agenda/" + req.params.event_id);
    });
};

module.exports.getAgenda = async (req, res) => {
  $where = { event: req.params.event_id };
  await Agenda.find($where)
    .populate("agenda_category")
    .exec(async (err, userObj) => {
      if (err) {
        $message = { message: "Something went wrong" };
        req.flash("errors", $message);
        return res.redirect("/agenda-list/" + req.params.event_id);
      } else {
        let data = userObj;
        let active = "Event";
        let title = "Agenda List";
        let right_active = "Agenda";
        let left_side = "active";
        return res.render("agenda/agenda_list", {
          layout: "layouts/eventLayout",
          event_id: req.params.event_id,
          active,
          title,
          right_active,
          left_side,
          data,
          moment: moment,
          errors: req.flash("errors"),
        });
      }
    });
};

module.exports.editAgenda = async (req, res) => {
  let id = req.params.id;
  let event_id = req.params.event_id;
  await Agenda.findOne({ _id: id }, async function (err, user) {
    if (err) {
      $message = { msg: "Something went wrong" };
      req.flash("errors", $message);
      return res.redirect("/edit-sponser/" + id + "/" + event_id);
    } else {
      let data = user;
      let active = "Event";
      let title = "Edit Agenda";
      let right_active = "Agenda";
      let left_side = "active";
      var agenda_data = await AgendaCategory.find().exec();
      var speaker_data = await User.find({
        event: req.params.event_id,
        role: 6,
      }).exec();
      var timezones = await Timezone.find().exec();
      console.log("dddddddddddddddddddddddddddd");
      console.log(data);
      res.render("agenda/edit_agenda", {
        layout: "layouts/eventLayout",
        event_id,
        active,
        moment,
        title,
        right_active,
        left_side,
        errors: req.flash("errors"),
        data,
        agenda_data,
        speaker_data,
        timezones,
      });
    }
  });
};

module.exports.updateAgenda = (req, res) => {
  let id = req.params.id;
  let event_id = req.params.event_id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);

  let errorsData = {
    agenda_type: "",
    title: "",
    agenda_category: "",
    agenda_date: "",
    start_time: "",
    end_time: "",
    time_zone: "",
    tags: "",
    featured: "",
    speakers: "",
    description: "",
    box_image: "",
    file_data: "",
    image_data: "",
    video_data: "",
  };
  if (errors.array().length > 0) {
    errors.array().forEach((value) => {
      errorsData[value.param] = value.msg;
    });

    req.flash("errors", errorsData);
    return res.redirect("/edit-agenda/" + id + "/" + event_id);
  }
  ////////////////////////////////////////////////////////////
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }
  var str = req.body.tags;
  var string = str.split(",");
  var d = req.body.agenda_date;
  var timeStamp = moment(d).format("X");
  var where = {
    agenda_type: req.body.agenda_type,
    title: req.body.title,
    agenda_category: req.body.agenda_category,
    agenda_date: timeStamp,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    featured: req.body.featured,
    time_zone: req.body.time_zone,
    tags: string,
    speakers: req.body.speakers,
    description: req.body.description,
    updated_at: created_date,
  };
  if (req.body.box_image) {
    where.box_image = req.body.box_image;
  }
  if (req.body.file_data) {
    where.docs = req.body.file_data;
  }
  if (req.body.image_data) {
    where.images = req.body.image_data;
  }
  if (req.body.video_data) {
    where.videos = req.body.video_data;
  }

  Agenda.findByIdAndUpdate({ _id: id }, where, { new: true }, function (
    err,
    result
  ) {
    if (err) {
      $message = { message: "Something went wrong" };
      req.flash("errors", $message);
      return res.redirect("/edit-agenda/" + id + "/" + event_id);
    } else {
      req.session.auth = result;
      $message = { msg: "Agenda updated successfully" };
      req.flash("errors", $message);
      return res.redirect("/edit-agenda/" + id + "/" + event_id);
    }
  });
};

module.exports.deleteAgenda = (req, res) => {
  Agenda.findByIdAndRemove(req.params.id, (err, data) => {
    if (typeof data == "undefined") {
      $message = { message: "Data not exist!" };
      req.flash("errors", $message);
      return res.redirect("/agenda-list/" + req.params.event_id);
    }
    if (err) {
      $message = { message: "Something went wrong" };
      req.flash("errors", $message);
      return res.redirect("/agenda-list/" + req.params.event_id);
    } else {
      if (data) {
        $message = { msg: "Agenda delete successfully" };
        req.flash("errors", $message);
        return res.redirect("/agenda-list/" + req.params.event_id);
      }
    }
  });
};
