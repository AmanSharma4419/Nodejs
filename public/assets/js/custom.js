
$(document).ready(function(){
   $("#add_form").submit(function(e) {
    $('.body-spinner').show();
      e.preventDefault(); // avoid to execute the actual submit of the form.
  
      var empty = $(this).parent().find("input").filter(function() {
        return this.value === "";
    });
    if(empty.length) {
        $('.alert-danger').show();
    }
    else
    {
      var form = $(this);
      var url = form.attr('action');
      $.ajax({
        type: "post",
        url: url,
        data: form.serialize(), // serializes the form's elements.
        dataType: "json",
        success: function(data)
        {
          $('.body-spinner').hide();
          $('.event_id').val(data.data._id); 
          window.location.href = "/add-event/step-two/"+data.data._id;
         // $('#nav-home-tab').removeAttr('data-toggle');
          $('.submit_event'). attr('disabled', true);
           // alert(data); // show response from the php script.
        }
      });
    }
      
      
  
      
  });


  $(document).on("change",'.upload-img',function() {

  $('.body-spinner').show();
      var fd = new FormData();
        var files = $(this)[0].files[0];
        fd.append('image',files);
        var self = this;
      //  alert('files');
   // var form = $(this);
   var url = "/api/image-upload";
  
   $.ajax({
          type: "post",
          url: url,
          data: fd, // serializes the form's elements.
          processData: false,
            contentType: false,
          success: function(data)
          {
           // alert(data.data);
            $('.body-spinner').hide();
          //  $(selector).val(value)
          $(self).closest('.addEImg').find('.image_upload').val(data.data); 
          $('.display_img').attr("src","/uploads/"+data.data);

           // $("#1").val(data.data); 
             // alert(data); // show response from the php script.
          }
        });
});


$(document).on("change",'.multiple_images',function() {

  $('.body-spinner').show();
      var fd = new FormData();
        var files = $(this)[0].files;
        var totalfiles = $(this)[0].files.length;
   for (var index = 0; index < totalfiles; index++) {
    fd.append("image", $(this)[0].files[index]);
   }
        //fd.append('image',files);
        //console.log(files)
        var self = this;
      //  alert('files');
   var form = $(this);
  var url = "/api/multiple-upload";
  
   $.ajax({
          type: "post",
          url: url,
          data: fd, // serializes the form's elements.
          processData: false,
            contentType: false,
          success: function(data)
          {
           // alert(data.data);
            $('.body-spinner').hide();
          //  $(selector).val(value)
          $.each(data.data, function(index, value) {
            var image12 = '/uploads/'+value.filename;
           // console.log(image12);
          //  $(".image_hidden").append("<input type='hidden' class='image_upload' name='image_data' value='"+image12+"'/>");
            $(".image_display").before("<div class='addEvntImgColl'><div class='updateEventImg'><img src='"+image12+"'><span class='itemTrash'><img src='/assets/images/navIcon/trash.png' /></span></div><input type='hidden' class='image_upload' name='image_data' value='"+value.filename+"'/></div>");
            
          });
         // $('.display_img').attr("src","/uploads/"+data.data);
          }
        });
});


$(document).on("change",'.multiple_files',function() {

  $('.body-spinner').show();
      var fd = new FormData();
        var files = $(this)[0].files;
        var totalfiles = $(this)[0].files.length;
   for (var index = 0; index < totalfiles; index++) {
    fd.append("image", $(this)[0].files[index]);
   }
        //fd.append('image',files);
        //console.log(files)
        var self = this;
      //  alert('files');
   var form = $(this);
  var url = "/api/multiple-upload";
  
   $.ajax({
          type: "post",
          url: url,
          data: fd, // serializes the form's elements.
          processData: false,
            contentType: false,
          success: function(data)
          {
           // alert(data.data);
            $('.body-spinner').hide();
          //  $(selector).val(value)
          $.each(data.data, function(index, value) {
            var image12 = '/uploads/'+value.filename;
            console.log(value);
            
          //  $(".image_hidden").append("<input type='hidden' class='image_upload' name='image_data' value='"+image12+"'/>");
            $(".filesuploadRow").append("<div class='filesupload'><div class='documentUpdate documentPDF'><div class='documentType'><img src='/assets/images/navIcon/docIcon.png' /></div><div class='documentText'><h4>"+value.filename+"</h4></div><div class='downDelete'><a target='_blank' href="+image12+" download><span class='fileDownload'><i class='fa fa-download'></i></span></a><span class='fileDelete'><i class='fa fa-trash'></i></span></div></div><input type='hidden' class='file_upload' name='file_data' value='"+value.filename+"'/></div>");

            // $(".filesuploadRow").append("<div class='filesupload'><div class='documentUpdate documentPDF'><div class='documentType'><img src='/assets/images/navIcon/docIcon.png' /></div><div class='documentText'><h4>"+value.filename+"</h4><p class=''><span class='fileData'>"+bytesToSize(value.size)+"</span></p></div><div class='downDelete'><a target='_blank' href="+image12+" download><span class='fileDownload'><i class='fa fa-download'></i></span></a><span class='fileDelete'><i class='fa fa-trash'></i></span></div></div><input type='hidden' class='file_upload' name='file_data' value='"+value.filename+"'/></div>");
            
          });
         // $('.display_img').attr("src","/uploads/"+data.data);
          }
        });
});
function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return 'n/a';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i == 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};


$(document).on("change",'.multiple_videos',function() {

  $('.body-spinner').show();
      var fd = new FormData();
        var files = $(this)[0].files;
        var totalfiles = $(this)[0].files.length;
   for (var index = 0; index < totalfiles; index++) {
    fd.append("image", $(this)[0].files[index]);
   }
        //fd.append('image',files);
        //console.log(files)
        var self = this;
      //  alert('files');
   var form = $(this);
  var url = "/api/multiple-upload";
  
   $.ajax({
          type: "post",
          url: url,
          data: fd, // serializes the form's elements.
          processData: false,
            contentType: false,
          success: function(data)
          {
           // alert(data.data);
            $('.body-spinner').hide();
          //  $(selector).val(value)
          $.each(data.data, function(index, value) {
            var image12 = '/uploads/'+value.filename;
           // console.log(image12);
           
            $(".video_display").before('<div class="addEvntImgColl"><div class="addEventVideoSec"><video class="eventVideo" id="myvid"><source src="'+image12+'" type="video/mp4"></video><button class="playpause" id="vidbutton"></button> <span class="itemTrash"><img src="/assets/images/navIcon/trash.png" /></span></div><input type="hidden" class="video_upload" name="video_data" value="'+value.filename+'"/></div>');
            
          });
        //  $('.display_img').attr("src","/uploads/"+data.data);
          }
        });
});

$(document).on("change",'.upload-vdo',function() {

  $('.body-spinner').show();
      var fd = new FormData();
        var files = $(this)[0].files[0];
        fd.append('image',files);
        var self = this;
      //  alert('files');
   // var form = $(this);
   var url = "/api/image-upload";
  
   $.ajax({
          type: "post",
          url: url,
          data: fd, // serializes the form's elements.
          processData: false,
            contentType: false,
          success: function(data)
          {
            
            $('.body-spinner').hide();
          //  $(selector).val(value)
          $(self).closest('.addEImg').find('.video_upload').val(data.data); 
           // $("#1").val(data.data); 
             // alert(data); // show response from the php script.
          }
        });
});


$(".add-image").on('click',function() {
   $(".image_append").append('<div class="form-group row"><label for="image" class="col-sm-3 col-form-label">Image</label><div class="col-sm-8"><input type="file" class="form-control upload-img" name="image" value="" id="logo" accept="image/*"><input type="hidden" class="image_upload" name="image_data"/></div><div class="col-sm-1"><i class="menu-icon typcn typcn-minus remove-image"></i></div></div>');
 });
 $(document).on("click",'.remove-image',function() {
   //alert('helloo');
  $(this).closest('.form-group').remove();
});


$(".add-video").on('click',function() {
  $(".video_append").append('<div class="form-group row "><label for="video" class="col-sm-3 col-form-label">Video</label><div class="col-sm-8"><input type="file" class="form-control upload-vdo" name="image" value="" id="video" accept="video/*"><input type="hidden" class="video_upload" name="video_data"/></div><div class="col-sm-1"><i class="menu-icon typcn typcn-minus remove-video"></i></div></div>');
});
$(document).on("click",'.remove-video',function() {
  //alert('helloo');
 $(this).closest('.form-group').remove();
});

$(document).on("keydown",'input',function() {
  $('.alert-danger').hide();
  $('.wrong').hide();
  $('.alert-success').hide();
});



$(".add_speaker").on('click',function() {
  var elmId = $(this).attr("id");
   $(".speaker_append").append('<div class="remove-div"><p class="card-description"> <button type="button" class="remove_speaker">- Speakers</button> </p><div class="row"><div class="col-md-6"><div class="form-group row"><label class="col-sm-3 col-form-label">Speaker Name</label><div class="col-sm-9"><input type="text" class="form-control" name="form['+elmId+'][name]" /></div></div></div><div class="col-md-6"><div class="form-group row"><label class="col-sm-3 col-form-label">Designation</label><div class="col-sm-9"><input type="text" class="form-control" name="form['+elmId+'][designation]"/></div></div></div></div><div class="row"><div class="col-md-6"><div class="form-group row"><label class="col-sm-3 col-form-label">Profile pic</label><div class="col-sm-9"><input type="file" class="form-control upload-img" name="image" value="" id="image" accept="image/*"><input type="hidden" class="image_upload" name="form['+elmId+'][profile_pic]"/></div></div></div><div class="col-md-6"><div class="form-group row"><label class="col-sm-3 col-form-label">Description</label><div class="col-sm-9"><input type="text" class="form-control" name="form['+elmId+'][description]"/></div></div></div></div></div>');
   $(this).attr('id', parseInt(elmId)+1);
 });

 $(document).on("click",'.remove_speaker',function() {
  var elmId = $('.add_speaker').attr("id");
  $('.add_speaker').attr('id', parseInt(elmId)-1);
  //alert('helloo');
 $(this).closest('.remove-div').remove();
});


$(document).on("click",'.itemTrash',function() {
 $(this).closest('.addEvntImgColl').remove();
});



$(document).on("click",'.fileDelete',function() {
  $(this).closest('.filesupload').remove();
 });
 



$("#add_speaker").submit(function(e) {

  e.preventDefault(); // avoid to execute the actual submit of the form.

  var empty = $(this).parent().find("input").filter(function() {
    return this.value === "";
});
if(empty.length) {
    $('.please_fill').show();
}
else
{
  $('.body-spinner').show();
  var form = $(this);
  //console.log(JSON.stringify(form.serialize()))
  var url = form.attr('action');
  $.ajax({
    type: "post",
    url: url,
    data: form.serialize(), // serializes the form's elements.
    dataType: "json",
    success: function(data)
    {
      $('.body-spinner').hide();
      if(data.status == 200)
      {
        //$('.wrong').show();
        // $('.event_id').val(data.data._id); 
        window.location.href = "/add-event/step-three/"+data.event_id;
        //$('#nav-home-tab').removeAttr('data-toggle');
        $('.submit_event'). attr('disabled', true);
      }
      else
      {
        $('.wrong').show();
      }
      
       // alert(data); // show response from the php script.
    }
  });
}
  
});
 

$("#add_agenda").submit(function(e) {

  e.preventDefault(); // avoid to execute the actual submit of the form.

  var empty = $(this).parent().find("input").filter(function() {
    return this.value === "";
});
var select = $(this).parent().find("select").filter(function() {
  return this.value === "";
});
var textarea = $(this).parent().find("textarea").filter(function() {
  return this.value === "";
});
if(empty.length) {
    $('.please_fill').show();
}
else if(textarea.length) {
  $('.please_fill').show();
}
else if(select.length) {
  $('.please_fill').show();
}
else
{
  $('.body-spinner').show();
  var form = $(this);
  //console.log(JSON.stringify(form.serialize()))
  var url = form.attr('action');
  $.ajax({
    type: "post",
    url: url,
    data: form.serialize(), // serializes the form's elements.
    dataType: "json",
    success: function(data)
    {
      $('.body-spinner').hide();
      if(data.status == 200)
      {
        //$('.wrong').show();
        // $('.event_id').val(data.data._id); 
        //window.location.href = "/add-event/step-three/"+data.event_id;
        //$('#nav-home-tab').removeAttr('data-toggle');
       // $('.submit_event'). attr('disabled', true);
       $('.alert-success').show();
       $('form').find("input, textarea,select").val("");
      }
      else
      {
        $('.wrong').show();
      }
      
       // alert(data); // show response from the php script.
    }
  });
}
  
});


// $(".add_agenda").on('click',function() {
//   var elmId = $(this).attr("id");
//   var speaker_data = JSON.parse('<%- JSON.stringify(data) %>');
//   console.log(speaker_data);
//  var select = $.each(speaker_data, function( index, value ) {'<option value="'+element._id+'">"'+element.name+'"</option>'});
//  console.log(select);
//  //  $(".agenda_append").append( }) ');
//    $(this).attr('id', parseInt(elmId)+1);
//  });

});

