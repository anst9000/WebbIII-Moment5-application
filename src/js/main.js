/***********************************************************************************
 *
 * This is a Apache REST API test page
 *
 * Author: Anders Strömberg
 * Date: 2019-09-26
 *
 * *********************************************************************************/
'use strict';

$(document).ready(_ => {
  $('#dtBasicExample').DataTable();

  // Show all courses taken
  let allCourses = $('#all-courses');
  let pagination = $('#pagination');
  let fetchResult = [];
  let url = preUrl + 'read.php';

  fetch(url)
    .then(resp => resp.json())
    .then(result => {
      console.log(result);
      fetchResult.push(result.records);

      let output = `
      <div class="table-responsive">
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
        let postID = result.records[i].id;
        let postName = result.records[i].name;
        let postCode = result.records[i].code;
        let postProg = result.records[i].progression;
        let postLink = result.records[i].syllabus;

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
      output += '</tbody></table></div>';

      allCourses.html(output);
      $('table').addClass('table');


      // Update an existing course
      // ==================================================================================
      $(document).on('click', '.edit', (event) => {
        let entry = '';
        let modalForm = '';
        $('#updateModalLabel').empty();
        $('.modal-body').empty();

        // Find the post in array and fill input fields
        for (let index = 0; index < fetchResult[0].length; ++index) {
          entry = fetchResult[0][index];
          if (entry.id === event.target.id) {
            break;
          }
        }

        $('#updateModalLabel').append('Uppdatera kursen ' + '<br />').append(entry.name);
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
        $('.modal-body').append(modalForm);
      });
      // ==================================================================================


      // Delete a course
      // ==================================================================================
      $(document).on('click', '.remove', (event) => {
        let entry = '';
        let modalForm = '';
        $('#deleteModalLabel').empty();
        $('.modal-body').empty();

        // Find the post in array and fill input fields
        for (let index = 0; index < fetchResult[0].length; ++index) {
          entry = fetchResult[0][index];
          if (entry.id === event.target.id) {
            break;
          }
        }

        $('#deleteModalLabel').append('Ta bort kursen ' + '<br />').append(entry.name);
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
        $('.modal-body').append(modalForm);
      });
      // ==================================================================================


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

      $('#create').click(_ => {
        createCourse();
      });
    });
});
