if (sessionStorage.getItem("token") != null) {
    window.location.pathname = '/../home'
}
var albumBucketName = 'outreachamrita';
var bucketRegion = 'us-west-2';
var IdentityPoolId = 'us-west-2:7adf791c-2ac9-4131-b587-f9960988dc6b';

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});





function addPhoto(){

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