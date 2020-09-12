var User = require("./../../../../models/User");
var Answer = require("./../../../../models/Answer");
var Timezone = require("./../../../../models/Timezone");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');




const jwt = require('jsonwebtoken');
const md5 = require('md5');

module.exports.login = async(req,res)=>{

 var params = req.body;
 var privateKey = "vnrvjrekrke";
//  var token_key = jwt.sign({ user: 'user' }, privateKey, {expiresIn: '14h'});
 var token_key = jwt.sign({ user: 'user' }, privateKey);
console.log(params);
  var isExist = await User.findOne({email: params.email}).exec();
  console.log(isExist);
     if(!isExist){
         return res.json({
             status: 400,
             message:"User not found"
         })
     }
     else if(isExist.password !== md5(params.password)){
        return res.json({
            status: 400,
            message:"Incorrect password"
        })
     }else{

     await User.findOneAndUpdate({email: params.email},{token: token_key}).exec();
     var data = await User.findOne({email: params.email}).exec();
       user = {
          _id: isExist._id,
          token: token_key
       }
        return res.json({
            status: 200,
            message:"Login successfully",
            user: data
        })
     }

}


module.exports.createUser = async(req,res)=>{
    if(!req.body) {
     return res.status(400).send({
         message: "Note content can not be empty"
     });
     }
     var user_data = await User.find({email:req.body.email}).exec();
      if(user_data.length>0)
      {
        return res.json({
            status: 400,
            message: 'Email already exit'
        })
    
      }
      else{
     // Create a User
     const Users = new User({
             first_name:req.body.first_name,
             last_name:req.body.last_name,
             email:req.body.email,
             event:req.body.event,
             mobile_number:req.body.mobile_number,
             job_title:req.body.job_title,
             user_role:req.body.user_role,
             state:req.body.state,
             company_name:req.body.company_name,
             industry:req.body.industry,
             role:3,
             status:1   ,
             password:md5(req.body.password),
             password_reset_code:0,
             profile_img:'user.png',
             created_at:created_date,
             updated_at:created_date
     });
     // Save User in the database
    await Users.save()
     .then(async data => {
        let user_id = Users._id;
       // console.log(user_id);
        let Question_d =req.body.questions;
        await Promise.all(Question_d.map(async item =>{
            if(item){
              return await Answer.register({user_id:user_id,event:req.body.event, question:item.question_id, answer:item.answer ,created_at:created_date,
                updated_at:created_date}) 
            }
        }))
        
       // return {data,...resolvedFinalArray}
        return res.send({ status: 200,
            message: 'User added successfully'});
     }).catch(err => {
            return res.send({ status: 500,
            message: 'Something went wrong!'});
     })

    }
 }



module.exports.updateStep_one = (req,res)=>{

////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
    });
    }

    if(req.body.profile_img)
    {
        var where = { 
            job_title:req.body.job_title,
            company_name:req.body.company_name,
            bio:req.body.bio,
            department:req.body.department,
            time_zone:req.body.time_zone,
            url:req.body.url,
            profile_img:req.body.profile_img,
            updated_at:created_date};
    }
    else{
        var where = { 
            job_title:req.body.job_title,
            company_name:req.body.company_name,
            bio:req.body.bio,
            department:req.body.department,
            time_zone:req.body.time_zone,
            url:req.body.url,
            updated_at:created_date};
    }
    User.findByIdAndUpdate({ _id: req.body.user_id },where,{new: true}, function(err, result) {
    if (err) {
        return res.send({ status: 500,
        message: 'Something went wrong!'});
    } else {
        return res.json({
            status: 200,
            message:"User updated successfully",
            data: result
        })
    }
    });
}



module.exports.updateStep_two = (req,res)=>{
  

  
    ////////////////////////////////////////////////////////////
        if(!req.body) {
            return res.status(400).send({
            message: "Note content can not be empty"
        });
        }
        var where = { 
            public_profile:req.body.public_profile,
            notification:req.body.notification,
            message_status:req.body.message_status,
            video_status:req.body.video_status,
            meeting_request:req.body.meeting_request,
            info_status:req.body.info_status,
            updated_at:created_date
        };
      
        User.findByIdAndUpdate({ _id: req.body.user_id },where,{new: true}, function(err, result) {
        if (err) {
            return res.send({ status: 500,
            message: 'Something went wrong!'});
        } else {
            return res.json({
                status: 200,
                message:"User updated successfully",
                data: result
            })
        }
        });
}

module.exports.updateStep_three = async(req,res)=>{

    ////////////////////////////////////////////////////////////
        if(!req.body) {
            return res.status(400).send({
            message: "Note content can not be empty"
        });
        }
      
        var where = { 
            region:req.body.region,
            country:req.body.country,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            interests:req.body.interests,
            updated_at:created_date
        };
      
        await User.findByIdAndUpdate({ _id: req.body.user_id },where,{new: true}, function(err, result) {
        if (err) {
            return res.send({ status: 500,
            message: 'Something went wrong!'});
        } else {
            return res.json({
                status: 200,
                message:"User updated successfully",
                data: result
            })
        }
        });
}


module.exports.addtime = async(req,res)=>{
  

  var array = ["Africa/Abidjan","Africa/Accra","Africa/Algiers","Africa/Bissau","Africa/Cairo","Africa/Casablanca","Africa/Ceuta","Africa/El_Aaiun","Africa/Johannesburg","Africa/Juba","Africa/Khartoum","Africa/Lagos","Africa/Maputo","Africa/Monrovia","Africa/Nairobi","Africa/Ndjamena","Africa/Sao_Tome","Africa/Tripoli","Africa/Tunis","Africa/Windhoek","America/Adak","America/Anchorage","America/Araguaina","America/Argentina/Buenos_Aires","America/Argentina/Catamarca","America/Argentina/Cordoba","America/Argentina/Jujuy","America/Argentina/La_Rioja","America/Argentina/Mendoza","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan","America/Argentina/San_Luis","America/Argentina/Tucuman","America/Argentina/Ushuaia","America/Asuncion","America/Atikokan","America/Bahia","America/Bahia_Banderas","America/Barbados","America/Belem","America/Belize","America/Blanc-Sablon","America/Boa_Vista","America/Bogota","America/Boise","America/Cambridge_Bay","America/Campo_Grande","America/Cancun","America/Caracas","America/Cayenne","America/Chicago","America/Chihuahua","America/Costa_Rica","America/Creston","America/Cuiaba","America/Curacao","America/Danmarkshavn","America/Dawson","America/Dawson_Creek","America/Denver","America/Detroit","America/Edmonton","America/Eirunepe","America/El_Salvador","America/Fort_Nelson","America/Fortaleza","America/Glace_Bay","America/Goose_Bay","America/Grand_Turk","America/Guatemala","America/Guayaquil","America/Guyana","America/Halifax","America/Havana","America/Hermosillo","America/Indiana/Indianapolis","America/Indiana/Knox","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Tell_City","America/Indiana/Vevay","America/Indiana/Vincennes","America/Indiana/Winamac","America/Inuvik","America/Iqaluit","America/Jamaica","America/Juneau","America/Kentucky/Louisville","America/Kentucky/Monticello","America/La_Paz","America/Lima","America/Los_Angeles","America/Maceio","America/Managua","America/Manaus","America/Martinique","America/Matamoros","America/Mazatlan","America/Menominee","America/Merida","America/Metlakatla","America/Mexico_City","America/Miquelon","America/Moncton","America/Monterrey","America/Montevideo","America/Nassau","America/New_York","America/Nipigon","America/Nome","America/Noronha","America/North_Dakota/Beulah","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/Nuuk","America/Ojinaga","America/Panama","America/Pangnirtung","America/Paramaribo","America/Phoenix","America/Port-au-Prince","America/Port_of_Spain","America/Porto_Velho","America/Puerto_Rico","America/Punta_Arenas","America/Rainy_River","America/Rankin_Inlet","America/Recife","America/Regina","America/Resolute","America/Rio_Branco","America/Santarem","America/Santiago","America/Santo_Domingo","America/Sao_Paulo","America/Scoresbysund","America/Sitka","America/St_Johns","America/Swift_Current","America/Tegucigalpa","America/Thule","America/Thunder_Bay","America/Tijuana","America/Toronto","America/Vancouver","America/Whitehorse","America/Winnipeg","America/Yakutat","America/Yellowknife","Antarctica/Casey","Antarctica/Davis","Antarctica/DumontDUrville","Antarctica/Macquarie","Antarctica/Mawson","Antarctica/Palmer","Antarctica/Rothera","Antarctica/Syowa","Antarctica/Troll","Antarctica/Vostok","Asia/Almaty","Asia/Amman","Asia/Anadyr","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Baghdad","Asia/Baku","Asia/Bangkok","Asia/Barnaul","Asia/Beirut","Asia/Bishkek","Asia/Brunei","Asia/Chita","Asia/Choibalsan","Asia/Colombo","Asia/Damascus","Asia/Dhaka","Asia/Dili","Asia/Dubai","Asia/Dushanbe","Asia/Famagusta","Asia/Gaza","Asia/Hebron","Asia/Ho_Chi_Minh","Asia/Hong_Kong","Asia/Hovd","Asia/Irkutsk","Asia/Jakarta","Asia/Jayapura","Asia/Jerusalem","Asia/Kabul","Asia/Kamchatka","Asia/Karachi","Asia/Kathmandu","Asia/Khandyga","Asia/Kolkata","Asia/Krasnoyarsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Macau","Asia/Magadan","Asia/Makassar","Asia/Manila","Asia/Nicosia","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Omsk","Asia/Oral","Asia/Pontianak","Asia/Pyongyang","Asia/Qatar","Asia/Qostanay","Asia/Qyzylorda","Asia/Riyadh","Asia/Sakhalin","Asia/Samarkand","Asia/Seoul","Asia/Shanghai","Asia/Singapore","Asia/Srednekolymsk","Asia/Taipei","Asia/Tashkent","Asia/Tbilisi","Asia/Tehran","Asia/Thimphu","Asia/Tokyo","Asia/Tomsk","Asia/Ulaanbaatar","Asia/Urumqi","Asia/Ust-Nera","Asia/Vladivostok","Asia/Yakutsk","Asia/Yangon","Asia/Yekaterinburg","Asia/Yerevan","Atlantic/Azores","Atlantic/Bermuda","Atlantic/Canary","Atlantic/Cape_Verde","Atlantic/Faroe","Atlantic/Madeira","Atlantic/Reykjavik","Atlantic/South_Georgia","Atlantic/Stanley","Australia/Adelaide","Australia/Brisbane","Australia/Broken_Hill","Australia/Currie","Australia/Darwin","Australia/Eucla","Australia/Hobart","Australia/Lindeman","Australia/Lord_Howe","Australia/Melbourne","Australia/Perth","Australia/Sydney","CET","CST6CDT","EET","EST","EST5EDT","Etc/GMT","Etc/GMT+1","Etc/GMT+10","Etc/GMT+11","Etc/GMT+12","Etc/GMT+2","Etc/GMT+3","Etc/GMT+4","Etc/GMT+5","Etc/GMT+6","Etc/GMT+7","Etc/GMT+8","Etc/GMT+9","Etc/GMT-1","Etc/GMT-10","Etc/GMT-11","Etc/GMT-12","Etc/GMT-13","Etc/GMT-14","Etc/GMT-2","Etc/GMT-3","Etc/GMT-4","Etc/GMT-5","Etc/GMT-6","Etc/GMT-7","Etc/GMT-8","Etc/GMT-9","Etc/UTC","Europe/Amsterdam","Europe/Andorra","Europe/Astrakhan","Europe/Athens","Europe/Belgrade","Europe/Berlin","Europe/Brussels","Europe/Bucharest","Europe/Budapest","Europe/Chisinau","Europe/Copenhagen","Europe/Dublin","Europe/Gibraltar","Europe/Helsinki","Europe/Istanbul","Europe/Kaliningrad","Europe/Kiev","Europe/Kirov","Europe/Lisbon","Europe/London","Europe/Luxembourg","Europe/Madrid","Europe/Malta","Europe/Minsk","Europe/Monaco","Europe/Moscow","Europe/Oslo","Europe/Paris","Europe/Prague","Europe/Riga","Europe/Rome","Europe/Samara","Europe/Saratov","Europe/Simferopol","Europe/Sofia","Europe/Stockholm","Europe/Tallinn","Europe/Tirane","Europe/Ulyanovsk","Europe/Uzhgorod","Europe/Vienna","Europe/Vilnius","Europe/Volgograd","Europe/Warsaw","Europe/Zaporozhye","Europe/Zurich","HST","Indian/Chagos","Indian/Christmas","Indian/Cocos","Indian/Kerguelen","Indian/Mahe","Indian/Maldives","Indian/Mauritius","Indian/Reunion","MET","MST","MST7MDT","PST8PDT","Pacific/Apia","Pacific/Auckland","Pacific/Bougainville","Pacific/Chatham","Pacific/Chuuk","Pacific/Easter","Pacific/Efate","Pacific/Enderbury","Pacific/Fakaofo","Pacific/Fiji","Pacific/Funafuti","Pacific/Galapagos","Pacific/Gambier","Pacific/Guadalcanal","Pacific/Guam","Pacific/Honolulu","Pacific/Kiritimati","Pacific/Kosrae","Pacific/Kwajalein","Pacific/Majuro","Pacific/Marquesas","Pacific/Nauru","Pacific/Niue","Pacific/Norfolk","Pacific/Noumea","Pacific/Pago_Pago","Pacific/Palau","Pacific/Pitcairn","Pacific/Pohnpei","Pacific/Port_Moresby","Pacific/Rarotonga","Pacific/Tahiti","Pacific/Tarawa","Pacific/Tongatapu","Pacific/Wake","Pacific/Wallis","WET"];

  let resolvedFinalArray = await Promise.all(array.map(async item =>{

      return await Timezone.register({timezone:item,created_at:created_date,
      updated_at:created_date})

    }))

    return res.json({
        status: 200,
        message:"User updated successfully",
        data: resolvedFinalArray,
        length: array.length
    })

}


module.exports.imageUpload = async(req,res)=>{
    console.log(req.body,"4444",req.file,"ddd",req.fileValidationError)
   try{
    if(typeof req.file == 'undefined' && typeof req.fileValidationError  == 'undefined'){
      return res.json({
        status: 400,
        message: 'Please select file!'
    })
    }
    else{
      if(typeof req.file == 'undefined' && typeof req.fileValidationError){
        return res.json({
          status: 400,
          message: 'Only upload jpeg,jpg and png file type!'
    })
        
      }
      else{
        
        return res.json({
          status: 200,
          data:req.file.filename,
          
          message: 'Image uploaded sucessfully'
    
      })
      }
    }
  }
  catch(err){
          return  res.json({
            status: 500,
            message: 'Something went wrong'
        })
    }
}


module.exports.logout = (req,res)=>{
    let bearer_token =req.headers['token'];
    let token = bearer_token.split(' ')[1];
   
    $where = {token: token}
    
    Doctor.findOne($where,function(err, doctor){
        
     if(doctor)
     {
         
        Doctor.findOneAndUpdate({ token:doctor.token },{token:''}, function (err,data) {
           
            if (err){
                console.log("error",err)
                return res.json({
                    status: 400,
                    message:"Error occured" +err
                })
            }
            else{
                console.log("deleted",data)
               
                    return res.json({
                        status: 200,
                        message:"Logout successfully"
                    })
               }
           });
      }
     else{
        return res.json({
            status: 400,
            message: 'Token Not Found'
     })
       }
    })
}




   

