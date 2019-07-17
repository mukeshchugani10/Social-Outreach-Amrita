var token = sessionStorage.getItem("token");


if (sessionStorage.getItem("token") == null) {
    window.location.pathname = '/admin'
}

$(document).ready( function () {


    $.ajax({
        async: true,
        url: "/api/utility/allsponsor",
        method: "GET",
        success: function (res, textStatus, xmLHttpRequest) {
            const table = $('#sponsor').DataTable({
                data: res.data,
                lengthChange: false,
                columns: [
                    { title: "Name" },
                    { title: "Email" },
                    { title: "Phone" }
                ]
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            alert('Some error has occured please try again after some time')
            window.location.pathname = '/admin';
        },
    });


    $.ajax({
        async: true,
        url: "/api/utility/allvolunteer",
        method: "GET",
        success: function (res, textStatus, xmLHttpRequest) {
            const table = $('#volunteer').DataTable({
                data: res.data,
                lengthChange: false,
                columns: [
                    { title: "Name" },
                    { title: "Email" },
                    { title: "Phone" },
                    { title: "Reason" },
                ]
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            alert('Some error has occured please try again after some time')
            window.location.pathname = '/admin';
        },
    });
    
} );