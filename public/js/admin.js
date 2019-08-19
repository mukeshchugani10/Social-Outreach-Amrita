if (sessionStorage.getItem("token") != null) {
    window.location.pathname = '/../home'
}


$(document).ready(function () {
    // $('form').submit(false);
    var $form = $('form');
   $form.submit(function(){
      $.post($(this).attr('action'), $(this).serialize(), function(response){
            if(response.auth == true){
                sessionStorage.setItem('token', response.token);
                window.location.href = '/../home'
            }
            else{
                swal({
                    text: "Invalid Credentials",
                    icon: "error",
                  })
            }
             
        },'json');
      return false;
   });
});