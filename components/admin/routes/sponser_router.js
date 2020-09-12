
const sponserController = require('./../controller/sponserController');
const auth = require('../../../helpers/admin/auth');
const { check } = require ('express-validator');
const multer = require('multer');
//var up = multer();
var path = require('path');
//app.use(up.array());
const DIR = './public/uploads';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, DIR)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+ '-' + file.originalname )
    }
  })
  
  let upload = multer({storage: storage});


module.exports = (router)=>
{
    //Admin  Routes        
    router.get('/add-sponser/:event_id',auth.afterLogin,sponserController.addSponser);

    router.post('/postsponser/:event_id',[
      check('membership').not().isEmpty().withMessage("Sponsor type field is required"),
      check('sponsor_name').not().isEmpty().withMessage("Sponsor name field is required"),
      check('company_name').not().isEmpty().withMessage("Company name field is required"),
      check('category').not().isEmpty().withMessage("Category field is required"),
      check('email').not().isEmpty().withMessage("Email field is required"),
      check('address').not().isEmpty().withMessage("Address field is required"),
      check('employees').not().isEmpty().withMessage("Employees field is required"),
      check('lounge_title').not().isEmpty().withMessage("Lounge title field is required"),
      check('description').not().isEmpty().withMessage("Description field is required"),
      check('image_data').not().isEmpty().withMessage("Logo field is required"),
    ],auth.afterLogin,sponserController.addSponserPost);

    router.get('/sponser-list/:event_id',auth.afterLogin,sponserController.getSponser);
    router.get('/edit-sponser/:id/:event_id',auth.afterLogin,sponserController.editSponser);

    router.post('/update-sponser/:id/:event_id',[
      check('membership').not().isEmpty().withMessage("Sponsor type field is required"),
      check('sponsor_name').not().isEmpty().withMessage("Sponsor name field is required"),
      check('company_name').not().isEmpty().withMessage("Company name field is required"),
      check('category').not().isEmpty().withMessage("Category field is required"),
      check('email').not().isEmpty().withMessage("Email field is required"),
      check('address').not().isEmpty().withMessage("Address field is required"),
      check('employees').not().isEmpty().withMessage("Employees field is required"),
      check('lounge_title').not().isEmpty().withMessage("Lounge title field is required"),
      check('description').not().isEmpty().withMessage("Description field is required"),
    ],auth.afterLogin,sponserController.updateSponser);

    router.get('/delete-sponsor/:id/:event_id',auth.afterLogin,sponserController.delete_sponsor);
    





}




