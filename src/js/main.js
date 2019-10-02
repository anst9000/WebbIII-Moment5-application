/***********************************************************************************
 *
 * This is a Apache REST API test page
 *
 * Author: Anders Strömberg
 * Date: 2019-09-26
 *
 * *********************************************************************************/
'use strict';

const preUrl = 'http://studenter.miun.se/~anst9000/writeable/dt173g/api/course/';

function submitUpdateForm() {
  let id = $('#updateid').val()
  let name = $('#updatename').val()
  let code = $('#updatecode').val()
  let progression = $('#updateprogression').val()
  let syllabus = $('#updatesyllabus').val()

  let info = {
    'id': id,
    'name': name,
    'code': code,
    'progression': progression,
    'syllabus': syllabus
  }
  let data = JSON.stringify(info)

  $.ajax({
    type: 'PUT',
    url: preUrl + 'update.php',
    dataType: 'json',
    data: data,
    success: result => {
      $('#updateModal').modal('toggle');

      $(".popup-overlay, .popup-content").modal("toggle");
      $("#popupHeader").text("Det gick bra!");
      $("#popupCourse").html("<span>" + name + "</span>")
      $("#popupInfo").text("Kursen är nu uppdaterad.");

      window.setTimeout(() => {
        // removes the modal after 2 sec
        $(window).scrollTop(0);
        $(".popup-overlay, .popup-content").modal("toggle");
        location.reload()
      }, 3000)
    }
  })
}

function submitDeleteForm() {
  let id = $('#deleteid').val()
  let name = $('#deletename').val()
  let info = { 'id': id }
  let data = JSON.stringify(info)

  $.ajax({
    type: 'DELETE',
    url: preUrl + 'delete.php',
    dataType: 'json',
    data: data,
    success: result => {
      $('#deleteModal').modal('toggle');

      $(".popup-overlay, .popup-content").modal("toggle");
      $("#popupHeader").text("Det lyckades.");
      $("#popupCourse").html("<span>" + name + "</span>")
      $("#popupInfo").text("Kursen är nu borttagen.");

      window.setTimeout(() => {
        // removes the "active" class to .popup and .popup-content after 2 sec
        $(window).scrollTop(0);
        $(".popup-overlay, .popup-content").modal("toggle");
        location.reload()
      }, 3000)
    },
    error: function (textStatus, errorThrown) {
      alert('Status: ' + textStatus);
      alert('Error: ' + errorThrown);
    }
  })
}

$(document).ready(_ => {
  $('#dtBasicExample').DataTable();

  // Show all courses taken
  let allCourses = $('#all-courses');
  let pagination = $('#pagination');
  let ajaxResult = []

  $.ajax({
    type: 'GET',
    url: preUrl + 'read.php',
    dataType: 'json',
    success: result => {
      ajaxResult.push(result.records);

      let output = `
        <table id="all-courses-table" class="table cell-border compact stripe" cellspacing="0" width="100%">
          <thead id="all-courses-table-head">
            <tr>
              <th class="th-sm">Kursnamn</th>
              <th class="th-sm">Kurskod</th>
              <th class="th-sm">Nivå</th>
              <th class="th-sm">Kursplan</th>
              <th class="th-sm">Ändra/Ta bort</th>
            </tr>
          </thead>
        <tbody id="all-courses-table-body">`;

      for (let i in result.records) {
        let postID = result.records[i].id
        let postName = result.records[i].name
        let postCode = result.records[i].code
        let postProg = result.records[i].progression
        let postLink = result.records[i].syllabus

        output += `
          <tr>
            <td>${postName}</td>
            <td>${postCode}</td>
            <td>${postProg}</td>
            <td>
              <input type="button" class="btn syllabus btn-primary" id="${postID}" value="Kursplan" onclick="window.location.href='${postLink}'" />
            </td>
            <td>
              <button id="${postID}" type="button" data-toggle="modal" data-target="#updateModal" class="btn edit btn-secondary">Ändra</button>
              <button id="${postID}" type="button" data-toggle="modal" data-target="#deleteModal" class="btn remove btn-danger">Ta bort</button>
            </td>
          </tr>`
      }
      output += '</tbody></table>';

      allCourses.html(output);
      $('table').addClass('table');

      // Update an existing course
      $(document).on('click', '.edit', (event) => {
        let entry = ''
        let modalForm = ''
        $('#updateModalLabel').empty()
        $('.modal-body').empty()

        // Find the post in array and fill input fields
        for (let index = 0; index < ajaxResult[0].length; ++index) {
          entry = ajaxResult[0][index]
          if (entry.id === event.target.id) {
            break
          }
        }

        $('#updateModalLabel').append('Uppdatera kursen ' + '<br />').append(entry.name)
        // Fill Modal
        modalForm = `
          <form name="update">
            <div class="form-group">
              <input class="form-control" id="updateid" type="hidden" name="id" value="${entry.id}" />
              Kursnamn<input class="form-control" id="updatename" type="text" name="name" value="${entry.name}" />
              Kurskod<input class="form-control" id="updatecode" type="text" name="code" value="${entry.code}" />
              Nivå (A, B, C, D, E)<input class="form-control" id="updateprogression" type="text" name="progression" value="${entry.progression}" />
              Länk till kursplan<input class="form-control" id="updatesyllabus" type="text" name="syllabus" value="${entry.syllabus}" />
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Stäng</button>
              <input type="button" class="btn btn-primary" id="updateButton" value="Spara" onClick="submitUpdateForm()" />
            </div>
          </form>`
        $('.modal-body').append(modalForm)
      });

      // Delete a course
      $(document).on('click', '.remove', (event) => {
        let entry = ''
        let modalForm = ''
        $('#deleteModalLabel').empty()
        $('.modal-body').empty()

        // Find the post in array and fill input fields
        for (let index = 0; index < ajaxResult[0].length; ++index) {
          entry = ajaxResult[0][index]
          if (entry.id === event.target.id) {
            break
          }
        }

        $('#deleteModalLabel').append('Ta bort kursen ' + '<br />').append(entry.name)
        // Fill Modal
        modalForm = `
          <form action="update.php" method="DELETE">
            <div class="form-group">
              <input class="form-control" id="deleteid" type="hidden" name="id" value="${entry.id}" />
              <input class="form-control" id="deletename" type="hidden" name="name" value="${entry.name}" />
              <p>Om du vill ta bort kursen</p>
              <p><span id="courseSpan">${entry.code} ${entry.name}</span></p>
              <p>, så klickar du på knappen <span id="removeSpan">Ta bort</span></p>
            </div>
          </form>`
        $('.modal-body').append(modalForm)
      });

      // Using library DataTable. Linking in index.html
      $('#all-courses-table').DataTable({
        pagingType: 'full',
        lengthMenu: [5, 10, 15, 20],
        language: {
          lengthMenu: 'Visa _MENU_ kurser per sida',
          zeroRecords: 'Ingen träff - tyvärr',
          info: 'Sidan _PAGE_ av _PAGES_',
          infoEmpty: 'Inga kurser fanns',
          search: 'Sök',
          infoFiltered: '(sorterat från _MAX_ kurser totalt)',
          paginate: {
            first: 'Första',
            last: 'Sista',
            next: 'Nästa',
            previous: 'Föregående'
          }
        }
      });
    }
  });


  $('#create').click(event => {
    event.preventDefault();
    console.log('Show create courses');
    let createCourse = $('#create-course');
    let name = $('#createname').val()
    let code = $('#createcode').val()
    let progression = $('#createprogression').val()
    let syllabus = $('#createsyllabus').val()


    let info = {
      'name': name,
      'code': code,
      'progression': progression,
      'syllabus': syllabus
    }
    let data = JSON.stringify(info)

    $.ajax({
      type: 'POST',
      url: preUrl + 'create.php',
      data: data,
      dataType: 'json',
      success: result => {
        $(window).scrollTop(0);
        $(".popup-overlay, .popup-content").modal("toggle");
        $("#popupHeader").text("Det är klart!");
        $("#popupCourse").html("<span>" + name + "</span>")
        $("#popupInfo").text("Kursen är tillagd.");

        window.setTimeout(() => {
          // removes the "active" class to .popup and .popup-content after 2 sec
          $(window).scrollTop(0);
          $(".popup-overlay, .popup-content").modal("toggle");
          location.reload()
        }, 3000)
      },
      error: function (textStatus, errorThrown) {
        alert('Status: ' + textStatus);
        alert('Error: ' + errorThrown);
      }
    });
  });
});
