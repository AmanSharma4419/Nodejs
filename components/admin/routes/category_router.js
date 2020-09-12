const companyCategoryController = require('./../controller/companyCategoryController');
const auth = require('../../../helpers/admin/auth');
const { check } = require ('express-validator');
var multer = require('multer');

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
    router.get('/add-category',auth.afterLogin,companyCategoryController.addCategory);

    router.post('/categorypost',[
        check('category').not().isEmpty().withMessage("Category field is required"),
    ],auth.afterLogin,companyCategoryController.addCategoryPost);


    router.get('/category-list',auth.afterLogin,companyCategoryController.getCategory);
    router.get('/edit-category/:id',auth.afterLogin,companyCategoryController.editCategory);
    router.post('/update-category/:id',upload.single('logo'),[
      check('category').not().isEmpty().withMessage("Category field is required"),
  ],auth.afterLogin,companyCategoryController.updateCategory);



    
  
}




