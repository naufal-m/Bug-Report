function hideStatusField() {
    // Hide the "Status" field and reset its value
    document.getElementById('statusContainer').style.display = 'none';
    document.getElementById('status').value = 'Open'; // Set the default status value
}

document.getElementById('bug_id').addEventListener('change', function() {
    var bugId = document.getElementById('bug_id').value;
     if (bugId.trim() === '') {
        // If the bug ID is cleared or empty, reset other fields to their initial state
        document.getElementById('description').value = '';
        document.getElementById('change').value = '';

        // Hide the "Status" field if the bug ID is cleared
        hideStatusField();
    } else {
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
});

// Add event listener for form submission
document.getElementById('updateBugForm').addEventListener('submit', function(event) {
    var bugId = document.getElementById('bug_id').value;
    if (bugId.trim() === '') {
        // If the bug ID is empty after form submission, hide the "Status" field
        hideStatusField();
    } else {
        // The "Status" field should remain visible and retain its value
        // You can add any additional processing or validation for the form submission here
        // For this example, we'll simply log a message to the console
        console.log("Form submitted with bug ID:", bugId);
    }

    // Prevent the form from submitting through regular HTML form submission
    event.preventDefault();
});