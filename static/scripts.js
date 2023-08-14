    function showAddBugsPopup(message) {
        const popup = document.getElementById("add-bugs-popup");
        const messageElement = document.getElementById("add-bugs-popup-message");
        messageElement.textContent = message;
        popup.style.display = "block";

        // Clear the input fields after submission
        document.getElementsByName('bug_id')[0].value = '';
        document.getElementsByName('description')[0].value = '';

        // Disable the Add Bugs form elements while the popup is displayed
        document.getElementsByName('bug_id')[0].disabled = true;
        document.getElementsByName('description')[0].disabled = true;
    }

    function hideAddBugsPopup() {
        const popup = document.getElementById("add-bugs-popup");
        popup.style.display = "none";

        // Enable the Add Bugs form elements after the popup is closed
        document.getElementsByName('bug_id')[0].disabled = false;
        document.getElementsByName('description')[0].disabled = false;
    }

    function showUpdateBugsPopup(message) {
        const popup = document.getElementById("update-bugs-popup");
        const messageElement = document.getElementById("update-bugs-popup-message");
//            console.log('POPUP => ', popup);
//            console.log('MSG EVENT => ', messageElement);
//            console.log('MSG => ', message);
        popup.style.display = "block";

        // Clear the input fields after submission
        document.getElementById('bug_id').value = '';
        document.getElementById('description').value = '';
        document.getElementById('change').value = '';
        document.getElementById('status').value = '';

        // Disable the form elements
        disableFormElements();
    }

    function hideUpdateBugsPopup() {
        const popup = document.getElementById("update-bugs-popup");
        popup.style.display = "none";

        // Enable the form elements after the Update Bugs popup is closed
        enableFormElements();
    }

    function addBugsFormSubmit() {
        const bugId = document.getElementsByName('bug_id')[0].value;
        const description = document.getElementsByName('description')[0].value;
        fetch('/add_bugs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `bug_id=${encodeURIComponent(bugId)}&description=${encodeURIComponent(description)}`,
        }).then(response => response.text())
          .then(message => {
                showAddBugsPopup(message);
                // Clear the input fields after successful submission
                document.getElementsByName('bug_id')[0].value = '';
                document.getElementsByName('description')[0].value = '';
                })
          .catch(error => console.error('Error:', error));
        return false; // Prevent form submission
    }


    function updateBugsFormSubmit() {
        const bugId = document.getElementById('bug_id').value;
        const change = document.getElementById('change').value;
        const status = document.getElementById('status').value;
        fetch('/update_bugs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `bug_id=${encodeURIComponent(bugId)}&change=${encodeURIComponent(change)}&status=
            ${encodeURIComponent(status)}`,
        }).then(response => response.text())
          .then(message => {
                showUpdateBugsPopup(message);
                // Clear the input fields after successful submission
                document.getElementById('bug_id').value = '';
                document.getElementById('description').value = '';
                document.getElementById('change').value = '';
                document.getElementById('status').value = '';
                })
          .catch(error => console.error('Error:', error));
        return false; // Prevent form submission
    }

    function disableFormElements() {
        document.getElementById('bug_id').disabled = true;
        document.getElementById('description').disabled = true;
        document.getElementById('change').disabled = true;
        document.getElementById('status').disabled = true;
        document.getElementById('updateButton').disabled = true;
    }


    function enableFormElements() {
        document.getElementById('bug_id').disabled = false;
        document.getElementById('description').disabled = false;
        document.getElementById('change').disabled = false;
        document.getElementById('status').disabled = false;
        document.getElementById('updateButton').disabled = false;
    }

    function openUpdateBugForm(bugId) {
        const popup = document.getElementById("popupContainer");
        const messageElement = document.getElementById("update-bugs-popup-message");
        messageElement.textContent = `Updating Bug ID ${bugId}`;
        popup.style.display = "block";

        // Clear the input fields after submission
        document.getElementById('bug_id').value = bugId;

        // Make an AJAX request to the server to get bug details based on the selected bug ID
        fetch('/get_bug_details?bug_id=' + bugId)
      .then(response => response.json())
      .then(data => {
        // Populate the form fields with the fetched bug details
        document.getElementById('description').value = data.Description;
        document.getElementById('change').value = data.Update;

        // Show the "Status" field
        document.getElementById('statusContainer').style.display = 'block';

        // Set the "Status" field value based on the fetched data
        document.getElementById('status').value = data.Status;
      });
    }

    function showDeleteIcon(element) {

    const deleteIcon = element.querySelector(".delete-icon");
    console.log(deleteIcon);
    if (deleteIcon) {
        deleteIcon.style.display = 'inline-block';
//        document.getElementsByClassName(deleteIcon).style.display = 'inline-block';
    }
    }

    function hideDeleteIcon(element) {
    console.log("hideDeleteIcon called");
    const deleteIcon = element.querySelector('.delete-icon');
    if (deleteIcon) {
        deleteIcon.style.display = 'none';
    }
    }

function deleteBug(bug_id) {
    if (confirm("Are you sure you want to delete Bug ID " + bug_id + " ?")) {
        fetch(`/delete_bug/${bug_id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            // Optionally, you can remove the row from the table if the deletion was successful
            const row = document.querySelector(`.bug-id[data-id="${bug_id}"]`).parentNode.parentNode;
            row.remove();
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}