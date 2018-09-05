function buildMetadata(sample) {
  var sampleURL = `/metadata/${sample}`

  d3.json(sampleURL).then((input_data) => {
    var selector = d3.select("#sample-metadata");
    selector.html("")
    keys = ["sample","ETHNICITY","GENDER","AGE","LOCATION","BBTYPE"];
    keys.forEach(x => {
      selector
          .append("p")
            .text(`${x}: ${input_data[`${x}`]}`);
      });
  
      // Use the first sample from the list to build the initial plot
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  });
};

function isItIn(number, array) {
  allen_iverson = false; // aka, The Answer 
  array.forEach(x => {
    if (x == number){
      allen_iverson = true;
    };
  });
  return allen_iverson;
}

function getIndexes(topValues, array) {
  var max_length = topValues.length;
  var allen_iverson = [];
  for (i = 0; i < topValues.length; i++){
    for (j = 0; j < array.length; j++){
      if (topValues[i] == array[j]) {
        allen_iverson.push(j);
        if (allen_iverson.length == max_length){
          return allen_iverson;
        }
        
      }
    };
  };
  return allen_iverson;
}

function topTen(array) { // finds top ten values and uses isItIn and 
  // getIndexes function to return an array of the indexes of top ten values in an input array
                          
  var topValues = [];
  for (i = 0; i < 10; i++) {
    var current_max = 0;
    if (i == 0){
      array.forEach(x => {
        if (x > current_max) {
          current_max = x;
        };
      });
      topValues.push(current_max);
    }else{
      array.forEach(x => {
        if (x > current_max & !isItIn(x,topValues)){
          current_max = x;
        }
      })
      topValues.push(current_max);
    };
  };
  var allen_iverson = getIndexes(topValues, array);
  return allen_iverson;
}; 

function valuesFromIndex(indexes,input_data){
  var allen_iverson = [];
  indexes.forEach(x => {
    allen_iverson.push(input_data[x])
  });
  return allen_iverson;
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // Create a PIE chart that uses data from your samples route (/samples/<sample>) to display the top 10 samples.

  var sampleURL = `/samples/${sample}`
// Use otu_ids for the x values
// Use sample_values for the y values
// Use sample_values for the marker size
// Use otu_ids for the marker colors
// Use otu_labels for the text values

  d3.json(sampleURL).then((input_data) => {
        x_values = input_data['otu_ids'];
        y_values = input_data['sample_values'];
        marker_size = input_data['sample_values'];
        marker_colors = input_data['otu_ids'];
        labels = input_data['otu_labels'];


        labels = input_data['otu_ids'];
        // @TODO: Build a Bubble Chart using the sample data
        var trace1 = {
          x: x_values,
          y: y_values,
          mode: 'markers',
          marker: {
            size: marker_size,
            color: marker_colors
          },
          labels: labels
        };
        
        var data = [trace1];
        
        var layout = {
          title: 'Marker Size',
          showlegend: false,
          height: 600,
          width: 1000
        };
        
        Plotly.newPlot('bubble', data, layout);
  });


    // @TODO: Build a Pie Chart
  // Create a PIE chart that uses data from your samples route (/samples/<sample>) 
  // to display the top 10 samples.

  // Use sample_values as the values for the PIE chart
  // Use otu_ids as the labels for the pie chart
  // Use otu_labels as the hovertext for the chart

  d3.json(sampleURL).then((input_data) => {
    sample_values = input_data['sample_values'];
    indexes = topTen(sample_values);
    labels = input_data['otu_ids'];
    hover = input_data['otu_labels'];
    console.log(valuesFromIndex(indexes,hover));


    var data = [{
      values: valuesFromIndex(indexes,sample_values),
      labels: valuesFromIndex(indexes,labels),
      type: 'pie',
      hovertext: valuesFromIndex(indexes,hover)
    }];
    
    var layout = {
      height: 400,
      width: 700
    };
    
    Plotly.newPlot('pie', data, layout);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();