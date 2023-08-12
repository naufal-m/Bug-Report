document.addEventListener("DOMContentLoaded", function () {
  const filterStatus = document.getElementById("filter-status");
  const bugRows = document.querySelectorAll("#bug-table tbody tr");
  const noRecordsRow = document.getElementById("no-records-row"); // Add this line


  filterStatus.addEventListener("change", function () {
    const selectedStatus = filterStatus.value;
    let hasMatchingRows = false; // Add this variable

    bugRows.forEach(function (row) {
      const statusColumn = row.querySelector("td:nth-child(4)");

      if (statusColumn) { // Check if statusColumn is not null
        if (selectedStatus === "" || statusColumn.textContent === selectedStatus) {
          row.style.display = ""; // Show matching row
          hasMatchingRows = true; // Set to true if at least once matching record
        } else {
          row.style.display = "none"; // Hide non-matching row
        }
      }
    });

      // Show/hide the "No records found." row
      if (hasMatchingRows) {
        noRecordsRow.style.display = "none"; // Hide the message
        } else {
          noRecordsRow.style.display = ""; // Show the message
      }

  });
});
