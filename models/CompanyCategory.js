var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema(
{
  category: String,
  created_at: Date,
  updated_at: Date
},{ collection:'company_categories'});

var CompanyCategory = mongoose.model('CompanyCategory', companySchema);

module.exports = CompanyCategory;

