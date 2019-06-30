function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  
  // Use `d3.json` to fetch the metadata for a sample
  var sample_url = `/metadata/${sample} `;
  d3.json(sample_url).then(function(sample){
     // Use d3 to select the panel with id of `#sample-metadata`
    var sample_data = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    sample_data.html("");
    // Use `Object.entries` to add each key and value pair to the table
  Object.entries(sample).forEach(function([key,value]) {
    var table_row = sample_data.append("h6")
    // tags for each key-value in the metadata.
    table_row.text(`${key}:${value}`);
  });
}
  )};


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // use data from @app.route("/samples/<sample>")
  d3.json(`/samples/${sample}`).then((data) => {
    // @TODO: Build a Bubble Chart using the sample data
 

    var bubble_layout = {hovermode:'closest',
                  title:'Sample Bubble Chart'
                  
    };
    var bubble_data = [{x:data.otu_ids,
                       y:data.sample_values,
                       text:data.otu_labels,
                       mode:"markers",
                       marker:{
                         color:data.otu_ids,
                         size:data.sample_values,
                         colorscale:"Rainbow"
                       }
                      }
                    ];

    Plotly.plot("bubble", bubble_data, bubble_layout);

     // @TODO: Build a Pie Chart
     var pie_data = [
      {
        values: data.sample_values.slice(0, 10),
        labels: data.otu_ids.slice(0, 10),
        hovertext: data.otu_labels.slice(0, 10),
        type: "pie"
      }
    ];

    var pie_layout = {
      margin: { t: 0, l: 0 }
    };

    Plotly.plot("pie", pie_data, pie_layout);
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
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
