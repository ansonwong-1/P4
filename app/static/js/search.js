function filterPlanes(planes) {
  // Add an event listener to the search form
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission

      // Get the search input value
      var searchInput = document
        .getElementById("searchInput")
        .value.trim()
        .toLowerCase();

      // Filter the planes based on the search input
      var filteredPlanes = planes.filter(function (plane) {
        var originCountry = plane[2].toLowerCase();
        return originCountry.includes(searchInput);
      });

      // Generate the table rows for the filtered planes
      var tableBody = document.getElementById("planeTableBody");
      tableBody.innerHTML = "";
      filteredPlanes.forEach(function (plane) {
        var row = document.createElement("tr");
        row.innerHTML = `
          <th scope="row">${plane[0]}</th>
          <td>${plane[1]}</td>
          <td>${plane[2]}</td>
          <td>${plane[3]}</td>
          <td>${plane[4]}</td>
        `;
        tableBody.appendChild(row);
      });
    });
}
