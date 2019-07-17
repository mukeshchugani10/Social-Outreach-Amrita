// $('#sponsor').on('submit', function(){
//     $.post($(this).attr('action'), $(this).serialize(), function(response){
//         console.log(response);  
//         // do something here on success
//     },'json');
//     return false;
//  });

$(document).ready(function () {
    // $('form').submit(false);
    var $form = $('form');
   $form.submit(function(){
      $.post($(this).attr('action'), $(this).serialize(), function(response){
            if(response.message === 'Added'){
                swal({
                    text: "We will contact you soon",
                    icon: "success",
                  }).then(() => {
                    location.reload();
                  })
            }
            else{
                swal({
                    text: response.message,
                    icon: "error",
                  })
            }
             
        },'json');
      return false;
   });
});