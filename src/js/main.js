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
  console.log('submitting')

  // document.forms['update'].submit()
  $('#updateModal').modal('toggle');
}

function submitDeleteForm() {
  console.log('submitting')

  // document.forms['update'].submit()
  $('#deleteModal').modal('toggle');
}




$(document).ready(_ => {
  console.log('started');
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
      console.log(result.records.length);
      // pagination.html(result.records.length);
      let output =
        '<table id="all-courses-table" class="table cell-border compact stripe" cellspacing="0" width="100%">' +
        '<thead id="all-courses-table-head">' +
        '<tr>' +
        '<th class="th-sm">Kursnamn</th>' +
        '<th class="th-sm">Kurskod</th>' +
        '<th class="th-sm">Nivå</th>' +
        '<th class="th-sm">Kursplan</th>' +
        '<th class="th-sm">Ändra/Ta bort</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="all-courses-table-body">';

      for (let i in result.records) {
        console.log(result.records[i]);
        let postID = result.records[i].id
        let postName = result.records[i].name
        let postCode = result.records[i].code
        let postProg = result.records[i].progression
        let postLink = result.records[i].syllabus
        console.log('postID = ' + postID)
        output +=
          '<tr><td>' + postName +
          '</td><td>' + postCode +
          '</td><td>' + postProg +
          '</td><td>' +
          '<a href="' + postLink + '" id="' + postID + '" type="button" class="btn syllabus btn-primary">Kursplan</a>' +
          '</td><td>' +
          '<button id="' + postID + '" type="button" data-toggle="modal" data-target="#updateModal" class="btn edit btn-secondary">Ändra</button>' +
          '<button id="' + postID + '" type="button" data-toggle="modal" data-target="#deleteModal"  class="btn remove btn-danger">Ta bort</button>' +
          '</td></tr>';
      }
      output += '</tbody></table>';

      allCourses.html(output);
      $('table').addClass('table');

      $(document).on('click', '.syllabus', (event) => {
        console.log("Handler for syllabus");
        console.log(event.target.id)
      });

      // Update an existing course
      $(document).on('click', '.edit', (event) => {
        let entry = ''
        let modalForm = ''
        $('#updateModalLabel').empty()
        $('.modal-body').empty()
        console.log("Handler for edit");
        console.log(event.target.id)
        console.log(ajaxResult)

        // Find the post in array and fill input fields
        for (let index = 0; index < ajaxResult[0].length; ++index) {
          console.log('searching')

          entry = ajaxResult[0][index]
          console.log('...very much')
          console.log(entry)
          if (entry.id === event.target.id) {
            console.log('yippie I"ve found it')
            console.log(entry.name)
            break
          }
        }

        $('#updateModalLabel').append('Uppdatera information för ' + '<br />').append(entry.name)
        // Fill Modal
        modalForm =
          '<form name="update">' +
          '<div class="form-group">' +
          'Kursnamn<input class="form-control" type="text" name="name" value="' + entry.name + '" /><br />' +
          'Kurskod<input class="form-control" type="text" name="code" value="' + entry.code + '" /><br />' +
          'Nivå (A, B, C, D, E)<input class="form-control" type="text" name="progression" value="' + entry.progression + '" /><br />' +
          'Länk till kursplan<input class="form-control" type="text" name="syllabus" value="' + entry.syllabus + '" /><br />' +
          '</div>' +

          '<div class="modal-footer">' +
          '<button type="button" class="btn btn-secondary" data-dismiss="modal">Stäng</button>' +
          '<input type="button" class="btn btn-primary" id="updateButton" value="Spara" onClick="submitUpdateForm()" />' +
          '</div>' +
          '</form >'
        $('.modal-body').append(modalForm)
      });

      // Delete a course
      $(document).on('click', '.remove', (event) => {
        let entry = ''
        let modalForm = ''
        $('#updateModalLabel').empty()
        $('.modal-body').empty()
        console.log("Handler for edit");
        console.log(event.target.id)
        console.log(ajaxResult)

        // Find the post in array and fill input fields
        for (let index = 0; index < ajaxResult[0].length; ++index) {
          console.log('searching')

          entry = ajaxResult[0][index]
          console.log('...very much')
          console.log(entry)
          if (entry.id === event.target.id) {
            console.log('yippie I"ve found it')
            console.log(entry.name)
            break
          }
        }

        $('#deleteModalLabel').append(entry.name)
        // Fill Modal
        modalForm =
          '<form action="update.php" method="POST">' +
          '<div class="form-group">' +
          '<p>Om du vill ta bort kursen</p>' +
          '<p><span id="courseSpan">' + entry.code + ' ' + entry.name + '</span></p>' +
          '<p>, så klickar du på knappen <span id="removeSpan">Ta bort</span></p>' +
          '</div>' +
          '</form >'
        $('.modal-body').append(modalForm)
      });

      // Using library DataTable. Linking in index.html
      $('#all-courses-table').DataTable({
        pagingType: 'full',
        lengthMenu: [1, 3, 5, 8, 10, 15, 25, 50],
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

  // Create eventlisteners for buttons
  $('#single').click(event => {
    event.preventDefault();
    console.log('Show single courses');
    let formData = $('form').serializeArray();
    console.log(formData);
  });
  $('#update').click(event => {
    event.preventDefault();
    console.log('Show update courses');
    let formData = $('form').serializeArray();
    console.log(formData);
  });
  $('#delete').click(event => {
    event.preventDefault();
    console.log('Show delete courses');
    let formData = $('form').serializeArray();
    console.log(formData);
  });

  $('#create').click(event => {
    event.preventDefault();

    console.log('Show create courses');
    let createCourse = $('#create-course');
    let data = $('form').serializeArray();
    console.log(data);

    $.ajax({
      type: 'POST',
      url: preUrl + 'create.php',
      data: data,
      dataType: 'json',
      success: result => {
        let output =
          '<table id="create-course-table">' +
          '<thead id="create-course-table-head">' +
          '<tr><th>Kurskod</th>' +
          '<th>Kursnamn</th>' +
          '<th>Progression</th>' +
          '<th>Kursplan</th>' +
          '</thead>' +
          '<tbody id="create-course-table-body">';

        console.log(result);
        output +=
          '<tr><td>' +
          result.name +
          '</td><td>' +
          result.code +
          '</td><td>' +
          result.progression +
          '</td><td>' +
          `<a href="${result.syllabus}" target="_blank"><button>Kursplan</button></a>` +
          '</td></tr>';
        output += '</tbody></table>';

        createCourse.html(output);
        $('table').addClass('table');
        console.log(output);
      },
      error: function (textStatus, errorThrown) {
        alert('Status: ' + textStatus);
        alert('Error: ' + errorThrown);
      }
    });
  });
});

// $.ajax({
//   type: 'POST',
//   url: preUrl + 'update.php',
//   dataType: 'json',
//   success: result => {
//     console.log('In here ' + result.records);
//   },
//   error: function (textStatus, errorThrown) {
//     console.log('Status: ' + textStatus);
//     console.log('Error: ' + errorThrown);
//   }
// })



// { message: "Course Created", id: null, name: "Kevin Smith", code: "vqxbtbhk", progression: "B", … }
// code: "vqxbtbhk"
// id: null
// message: "Course Created"
// name: "Kevin Smith"
// progression: "B"
// syllabus: "https://www.miun.se/utbildning/kurser/Sok-kursplan/kursplan/?kursplanid=21486"
// __proto__: Object
