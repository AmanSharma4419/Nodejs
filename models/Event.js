var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var eventSchema = new Schema(
  {
    client_id: { type: Schema.Types.ObjectId, ref: "User" },
    title: String,
    description: String,
    registeration_id: String,
    site_url: String,
    dashboard: String,
    start_date: Date,
    end_date: Date,
    images: [String],
    videos: [String],
    created_at: Date,
    updated_at: Date,
  },
  { collection: "events" }
);

var Event = mongoose.model("Event", eventSchema);

module.exports = Event;
