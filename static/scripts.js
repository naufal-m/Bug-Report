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
        messageElement.textContent = message;
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

