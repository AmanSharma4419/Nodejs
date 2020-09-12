var CompanyCategory = require("../../../models/CompanyCategory");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
const { validationResult } = require ('express-validator');
var moment = require('moment');

module.exports.addCategory = (req,res)=>{
   
    if(typeof req.flash('data')=='undefined')
    {
        var data = {
            category:'',
        };
        req.flash("data",data);
    }
    
    let active = 'Category';
    let title = 'Add Category';
     res.render('company_category/add_category',{active,title,data: req.flash('data'),errors:req.flash('errors'),reset:req.flash("reset")});
}

module.exports.addCategoryPost = (req,res)=>{

    var data = {category:req.body.category};
    ///////////// Validate request//////////////////////////
    const errors = validationResult(req);
     
    let errorsData = {
        name:'',
                };
    if (errors.array().length > 0)
    { 
        errors.array().forEach((value)  => 
    {
        errorsData[value.param] = value.msg;    
    });

        req.flash("errors",errorsData); 
        req.flash("data",data); 
        return res.redirect('/add-category');
     }
    ////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
     });
    }


   
$where = {category:req.body.category};
CompanyCategory.findOne($where,function(err, user) 
    {
       if(user)
       {
        $message = {message:'Category already exist!'};
            req.flash('errors', $message);   
            req.flash("data",data); 
            return res.redirect('/add-category');
       
       }
       else{
            // Create a User
    const categories = new CompanyCategory({
        category:req.body.category,
       created_at:created_date,
       updated_at:created_date
    });

            // Save User in the database
            categories.save()
            .then(data => {
                $message = {msg:'Category saved successfully!'};
                req.flash('errors', $message);    
                return res.redirect('/add-category');
            }).catch(err => {
                $message = {message:'Some error occurred!'};
                req.flash('errors', $message);  
                return res.redirect('/add-category');
            
            })
        }
    });
 

}
   

module.exports.getCategory = (req,res)=>{
    CompanyCategory.find(function(err, userObj){ 
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/category-list');
        } 
        else{
          let data = userObj;
          let active = 'Category';
          let title =  'Category List';
             return  res.render('company_category/category_list',{active,title,data,moment , errors:req.flash("errors"), message:req.flash("message")});
         
        }
      });
 
    
}


module.exports.editCategory = (req,res)=>
{
    let id= req.params.id;
    CompanyCategory.findOne({_id:id},function(err, user)
    { 
       if(err)
       {
          $message ={message:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-category');
       } 
       else
       {
          
          let data = user; 
          //data.profile_img = process.env.IMAGE_URL+user.profile_img;
         // console.log(data);
         let active = 'Category';
          let title =  'Edit Category';
         res.render('company_category/edit_category',{active,title,errors:req.flash("errors"),data});
        }
    });
}


module.exports.updateCategory = (req,res)=>{
  
  let id = req.params.id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);
 
  let errorsData = {
    category:''
  };
  if (errors.array().length > 0)
  { 
    errors.array().forEach((value)  => 
    {
      errorsData[value.param] = value.msg;    
    });

    req.flash("errors",errorsData); 
    return res.redirect('/edit-category');
 }
////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
    });
    }

    var where = { category:req.body.category};
    CompanyCategory.findByIdAndUpdate({ _id: id },where,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-category/'+id);
    } else {
        req.session.auth =result;
        $message ={msg:'Category updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-category/'+id);
    }
    });
}

   

