// $('#sponsor').on('submit', function(){
//     $.post($(this).attr('action'), $(this).serialize(), function(response){
//         console.log(response);  
//         // do something here on success
//     },'json');
//     return false;
//  });


function getDivString(index, url, title, text) {

  if (index % 2 == 0) {
    var string = `<div class="row" style="margin-bottom: 3%;">
  <div class="col-md-7 left-image">
    <img src="${url}" style="margin-top: 50px; height:305px;">
  </div>
  <div class="col-md-5">
    <div class="right-feature-text">
      <h4>${title}</h4>
      <p>${text}</p>
      <div class="primary-button">
        <a onclick="loadevent('${url}')">Discover More</a>
      </div>
    </div>
  </div>
</div>`
    return string;
  } else {
    var string = `<div class="row" style="margin-bottom: 3%;">
    <div class="col-md-5">
      <div class="right-feature-text">
        <h4>${title}</h4>
        <p>${text}</p>
        <div class="primary-button">
          <a onclick="loadevent('${url}')">Discover More</a>
        </div>
      </div>
    </div>
    <div class="col-md-7 left-image">
      <img src="${url}" style="margin-top: 50px; height:305px;">
    </div>
  </div>`
    return string;
  }

}

function loadevent(url) {
  $.ajax({
    async: true,
    url: "/api/utility/getevent",
    method: "POST",
    data: { url: url },
    success: function (res, textStatus, xmLHttpRequest) {
      $('#event-title').html(res.event.heading);
      $('#event-image').prop('src',res.event.url);
      $('#event-text').html(res.event.longtext);
      var sponli = "";
      res.sponsor.forEach(element => {
        sponli += element.sponsordetails[0].name;
        sponli += "<br>"
      });

      var volli = "";
      res.volunteer.forEach(element => {
        volli += element.volunteerdetails[0].name;
        volli += "<br>"
      });

      $('#event-volunteer').html(volli);
      $('#event-sponsor').html(sponli);
      $("#hidden-li").click()
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.responseJSON.message);
      alert('Some error has occured please try again after some time')
    },
  });
}

$(document).ready(function () {
  // $('form').submit(false);
  var $form = $('form');
  $form.submit(function () {
    $.post($(this).attr('action'), $(this).serialize(), function (response) {
      if (response.message === 'Added') {
        swal({
          text: "We will contact you soon",
          icon: "success",
        }).then(() => {
          location.reload();
        })
      }
      else {
        swal({
          text: response.message,
          icon: "error",
        })
      }

    }, 'json');
    return false;
  });


  $.ajax({
    async: true,
    url: "/api/utility/getevents",
    method: "GET",
    success: function (res, textStatus, xmLHttpRequest) {
      let obj = res.data;
      let fin = "";
      for (let i = 0; i < obj.length; i++) {
        fin += getDivString(i, obj[i].url, obj[i].heading, obj[i].text)
      }
      console.log(fin)
      document.getElementById("eventslist").innerHTML = fin;
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.responseJSON.message);
      alert('Some error has occured please try again after some time')
    },
  });







});