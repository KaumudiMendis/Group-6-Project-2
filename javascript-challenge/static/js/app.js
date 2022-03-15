// from data.js
var tableData = data;

// Get a reference to the table body
var tbody = d3.select("tbody");

// Append data into table
data.forEach((ufoSighting) => {
  var row = tbody.append("tr");
  Object.entries(ufoSighting).forEach(([key, value]) => {
    var cell = row.append("td");
    cell.text(value);
  });
});

// Select the button
var button = d3.select("button");

// Select the form
var form = d3.select("form");

// Create event handlers 
button.on("click", ufoFilter);
form.on("submit",ufoFilter);

//Create a function for when either the button is clicked or form is submitted
function ufoFilter(){

  // Prevent the page from refreshing
  d3.event.preventDefault();
  
  //Store the input element
  var sightingDateElement=d3.select("#datetime");
  
  //Store the input text from above element
  var sightingDate = sightingDateElement.property("value");
  
  //Create a filtered set of data using arrow notation 
  var sightingData = tableData.filter(sighting => sighting.datetime === sightingDate);

  //Create a condition in which the form is cleared, the original data returns
  if(sightingDate != ""){//if the form bar is not empty

    //Clear the existing table
    tbody.html("");

    //Feed in the filtered dataset
    sightingData.forEach((ufoSighting) => {
      var row = tbody.append("tr");
      Object.entries(ufoSighting).forEach(([key, value]) => {
        var cell = row.append("td");
        cell.text(value);
      });
    });
  }

  else{ //If the form bar is empty 

    //Clear the existing table
    tbody.html("");

    //Feed in the full data table
    data.forEach((ufoSighting) => {
      var row = tbody.append("tr");
      Object.entries(ufoSighting).forEach(([key, value]) => {
        var cell = row.append("td");
        cell.text(value);
      });
    });
  }

}