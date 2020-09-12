var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    membership_type: { type: Schema.Types.ObjectId, ref: "MembershipType" },
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    email: { type: String, required: false, unique: true },
    first_name: { type: String },
    last_name: { type: String },
    password: { type: String },
    mobile_number: { type: String, required: false },
    role: Number,
    status: Number,
    address: String,
    dob: String,
    sponsor_name: String,
    company_name: String,
    employees: String,
    education: String,
    designation: String,
    company_type: { type: Schema.Types.ObjectId, ref: "CompanyCategory" },
    lounge_title: String,
    experience: String,
    space_code: String,
    game_code: String,
    lounge_type: String,
    job_title: String,
    shop_url: String,
    category: { type: Schema.Types.ObjectId, ref: "CompanyCategory" },
    user_role: String,
    state: String,
    description: String,
    person_name: String,
    company_name: String,
    industry: String,
    bio: String,
    department: String,
    chat_token: String,
    url: String,
    region: { type: String, default: "" },
    country: String,
    latitude: String,
    longitude: String,
    time_zone: String,
    linkedin_url: String,
    facebook_url: String,
    twitter_url: String,
    verification_code: String,
    topic: String,
    public_profile: { type: Number, default: 1 },
    notification: { type: Number, default: 1 },
    video_status: { type: Number, default: 1 },
    message_status: { type: Number, default: 1 },
    meeting_request: { type: Number, default: 2 },
    info_status: { type: Number, default: 1 },
    interests: [String],
    token: { type: String },
    password_reset_code: String,
    profile_img: { type: String, default: "user.png" },
    created_at: Date,
    updated_at: Date,
  },
  { collection: "users" }
);

var User = mongoose.model("User", userSchema);

module.exports = User;