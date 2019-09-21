d3.json("samples.json").then((data) => {
    //  Create the data

    var metadata = data.metadata;
    var samples = data.samples;

})


//make a function so that when the user submits an ID, it passes that ID into the refresh function
function handleSubmit(){
    d3.event.preventDefault();

    var id_input = d3.select("#subjectinput").node().value;

    refreshCharts(id_input);

}


//refresh charts - gets called when function handleSubmit is executed
function refreshCharts(givenid){

    d3.json("samples.json").then((data) => {
        //  Create the data
        var metadata = data.metadata;
        var samples = data.samples;

        //trimming data down to just the id inputted
        var selected_metadata = metadata.filter(metadata => metadata.id == givenid);
        var selected_samples = samples.filter(samples => samples.id == givenid);
        

        //~~~~~~~~~~~~~~~~~~~HORIZONTAL BAR CHART ~~~~~~~~~~~~~
        // defining 10 otu ids
        var otu_ids = selected_samples[0]["otu_ids"];
        var otu_trimmed = otu_ids.slice(0,10);
        var otu_10 = otu_trimmed.map((each) => `OTU ${each}`).reverse();

        //defining 10 sample values
        var sample_values = selected_samples[0]["sample_values"];
        var sample_10 = sample_values.slice(0,10).reverse();

        //defining 10 labels
        var sample_labels = selected_samples[0]["otu_labels"];
        var labels_10 = sample_labels.slice(0,10).reverse();

        //make trace
        var trace1 = {
            x:sample_10,
            y:otu_10,
            text:labels_10,
            type:"bar",
            orientation:"h"
        };
        var databar = [trace1];
        var layoutbar = {
            title: "Top 10 OTUs",
            margin: {
              l: 100,
              r: 100,
              t: 100,
              b: 100
            }
          };
        Plotly.newPlot("bar", databar, layoutbar);

        //~~~~~~~~~~~~~~BUBBLE CHART~~~~~~~~~~~~~~~~~~~
        //defining bubble trace
        var desired_maximum_marker_size=4000;
        var trace2={
            x:otu_ids,
            y:sample_values,
            text:sample_labels,
            mode:'markers',
            marker:{
                color:otu_ids,
                size:sample_values,

            },
            type:"scatter"
        };
        var databubble=[trace2]
        Plotly.newPlot("bubble",databubble);

        //~~~~~~~~DEMOGRAPHIC SUMMARY~~~~~~~~~~~~~
        var summ_body = d3.select("#metadata-ul");
        selected_metadata.forEach((item)=>{
            Object.entries(item).forEach(([key,value])=>{
                var row = summ_body.append("li")
                row.text(`${key}:${value}`);
                
            })
        })


        d3.select("#sample-metadata")
        

        console.log(selected_metadata);
        console.log(selected_samples);
        console.log(otu_trimmed, otu_10, sample_10, labels_10);

})
}

d3.select("#submit").on("click", handleSubmit);