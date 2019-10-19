const preUrl = 'http://studenter.miun.se/~anst9000/writeable/dt173g/api/course/';

function submitUpdateForm() {
  let id = $('#updateid').val();
  let name = $('#updatename').val();
  let code = $('#updatecode').val();
  let progression = $('#updateprogression').val();
  let syllabus = $('#updatesyllabus').val();

  let data = {
    'id': id,
    'name': name,
    'code': code,
    'progression': progression,
    'syllabus': syllabus
  };

  let url = preUrl + 'update.php';
  let parcel = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };

  fetch(url, parcel)
    .then(resp => resp.json())
    .then(result => {
      console.log(result);
      $("#updateModal").modal('toggle');
      $('.modal-body').html("");

      $("#updateInfoModal").modal("toggle");
      $('#updateInfoModalLabel').text("Det gick bra!");
      $("#updateInfoModal .modal-body").html("<p><span>" + name + "</span></p><br>").append("<p>Kursen är nu uppdaterad</p>");

      slowlyCloseModal('#updateInfoModal');
    }).catch(err => {
      console.error("Something went wrong with update request. " + err);
    });
}

function submitDeleteForm() {
  let id = $('#deleteid').val();
  let name = $('#deletename').val();
  let data = {
    'id': id
  };

  let url = preUrl + 'delete.php';
  let parcel = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };

  fetch(url, parcel)
    .then(resp => resp.json())
    .then(result => {
      console.log(result);
      $('#deleteModal').modal('toggle');
      $('.modal-body').html("");

      $("#deleteInfoModal").modal("toggle");
      $('#deleteInfoModalLabel').text("Det lyckades.");
      $("#deleteInfoModal .modal-body").html("<p><span>" + name + "</span></p><br>").append("<p>Kursen är nu borttagen</p>");

      slowlyCloseModal('#deleteInfoModal');
    }).catch(err => {
      console.error("Something went wrong with delete request. " + err);
    });
}

function createCourse() {
  let name = $('#createname').val();
  let code = $('#createcode').val();
  let progression = $('#createprogression').val();
  let syllabus = $('#createsyllabus').val();

  let data = {
    "name": name,
    "code": code,
    "progression": progression,
    "syllabus": syllabus
  };
  let url = preUrl + "create.php";

  const parcel = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };

  fetch(url, parcel)
    .then(resp => resp.json())
    .then(result => {
      console.log(result);
      $(window).scrollTop(0);
      $('.modal-body').html("");

      $("#createInfoModal").modal("toggle");
      $('#createInfoModalLabel').text("Det är klart!");
      $("#createInfoModal .modal-body").html("<p><span>" + name + "</span></p><br>").append("<p>Kursen är tillagd.</p>");

      slowlyCloseModal('#createInfoModal');
    }).catch(err => {
      console.error('There was a problem with the POST request: ', err.message);
    });
}

function slowlyCloseModal(element) {
  window.setTimeout(() => {
    // removes the "active" class to .popup and .popup-content after 2,5 sec
    $(window).scrollTop(0);
    $(element).modal("toggle");
    location.reload();
  }, 2500);
}
