var token = sessionStorage.getItem("token");
var currentPhotoUrl = "";

var assignvol = null;
var assignspon = null;

if (sessionStorage.getItem("token") == null) {
    window.location.pathname = '/admin'
}

var s3Url = 'https://outreachamrita.s3-us-west-2.amazonaws.com/'
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
    params: { Bucket: albumBucketName }
});


function addPhoto() {
    var files = document.getElementById('photoupload').files;
    if (!files.length) {
        return alert('Please choose a file to upload first.');
    }
    var file = files[0];
    var fileName = file.name;
    var photoKey = fileName;
    $("#addphoto").attr('class', "btn ld-ext-right running");
    $("#addphoto").html(`Uploading <div class="ld ld-ring ld-spin"></div>`);
    s3.upload({
        Key: photoKey,
        Body: file,
        ACL: 'public-read'
    }, function (err, data) {
        if (err) {
            return alert('There was an error uploading your photo: ', err.message);
        }
        currentPhotoUrl = s3Url + encodeURIComponent(photoKey)
        $("#addphoto").attr('class', "btn ld-ext-right");
        $("#addphoto").html("Uploaded");
        $("#addphoto").attr('disabled', true);
        alert('Successfully uploaded photo.');
    });
}


function addEvent() {
    // console.log(mainsel.selected());
    var sel = mainsel.selected();


    var vol = sel.reduce((results, ele) => {
        let a = ele.split('$');
        if (a[1] === 'volunteer') results.push(a[0]) // modify is a fictitious function that would apply some change to the items in the array
        return results
    }, [])

    var volstr = "";
    vol.forEach(element => {
        volstr += element;
        volstr += ",";
    });

    volstr = volstr.slice(0, -1);

    var spon = sel.reduce((results, ele) => {
        let a = ele.split('$');
        if (a[1] === 'sponsor') results.push(a[0]) // modify is a fictitious function that would apply some change to the items in the array
        return results
    }, [])


    var sponstr = "";
    spon.forEach(element => {
        sponstr += element;
        sponstr += ",";
    });

    sponstr = sponstr.slice(0, -1);

    console.log(volstr)
    console.log(sponstr)

    if (currentPhotoUrl == "") {
        alert("Please upload image first")
        return;
    }
    var doc = document.implementation.createDocument("", "", null);
    var rootElem = doc.createElement("data");

    var urlelem = doc.createElement("url");
    urlelem.innerHTML = currentPhotoUrl
    rootElem.appendChild(urlelem)

    var headingelem = doc.createElement("title");
    headingelem.innerHTML = document.getElementById("heading").value;
    rootElem.appendChild(headingelem)

    var textelem = doc.createElement("text");
    textelem.innerHTML = document.getElementById("event_descr").value;
    rootElem.appendChild(textelem)

    var volelem = doc.createElement("volunteer");
    volelem.innerHTML = volstr;
    rootElem.appendChild(volelem);

    var sponelem = doc.createElement("sponsor");
    sponelem.innerHTML = sponstr;
    rootElem.appendChild(sponelem);


    doc.appendChild(rootElem);
    var str = new XMLSerializer().serializeToString(doc);

    var data = {
        doc: str
    }

    $.ajax({
        async: true,
        url: "/api/utility/addevent",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            alert(res.message)
            location.reload()
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseJSON.message)
        }
    });

}

function setvolemail(ele) {
    assignvol = ele;
    assignspon = null;
}

function setsponemail(ele) {
    assignspon = ele;
    assignvol = null;
}


function assignevent() {
    var url = eventsel.selected();
    if (assignvol) {
        $.ajax({
            async: true,
            url: "/api/utility/assignvolunteer",
            method: "POST",
            data: { url: url, email: assignvol },
            success: function (res, textStatus, xmLHttpRequest) {
                location.reload();
                $('#li-volunteer').click();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                alert('Some error has occured please try again after some time')
                window.location.pathname = '/admin';
            },
        });
    } else {
        $.ajax({
            async: true,
            url: "/api/utility/assignsponsor",
            method: "POST",
            data: { url: url, email: assignspon },
            success: function (res, textStatus, xmLHttpRequest) {
                location.reload();
                $('#li-sponsor').click();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                alert('Some error has occured please try again after some time')
                window.location.pathname = '/admin';
            },
        });

    }
}

$(document).ready(function () {
    document.getElementById("event_descr").value = "";
    document.getElementById("heading").value = "";
    $.ajax({
        async: false,
        url: "/api/utility/allsponsor",
        method: "GET",
        success: function (res, textStatus, xmLHttpRequest) {
            var obj = res.data;
            obj.forEach(element => {
                $.ajax({
                    async: false,
                    url: "/api/utility/sponsorevent",
                    method: "POST",
                    data: { email: element[1] },
                    success: function (res, textStatus, xmLHttpRequest) {
                        element.push(res.name);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(xhr.responseJSON.message);
                        alert('Some error has occured please try again after some time')
                    },
                });
            });

            const table = $('#sponsor').DataTable({
                data: obj,
                lengthChange: false,
                columns: [
                    { title: "Name" },
                    { title: "Email" },
                    { title: "Phone" },
                    { title: "Event" }
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

            var obj = res.data;
            obj.forEach(element => {
                $.ajax({
                    async: false,
                    url: "/api/utility/volunteerevent",
                    method: "POST",
                    data: { email: element[1] },
                    success: function (res, textStatus, xmLHttpRequest) {
                        element.push(res.name);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(xhr.responseJSON.message);
                        alert('Some error has occured please try again after some time')
                    },
                });
            });
            const table = $('#volunteer').DataTable({
                data: res.data,
                lengthChange: false,
                columns: [
                    { title: "Name" },
                    { title: "Email" },
                    { title: "Phone" },
                    { title: "Reason" },
                    { title: "Event" }
                ]
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            alert('Some error has occured please try again after some time')
            window.location.pathname = '/admin';
        },
    });


});