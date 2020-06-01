function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      PANEL.html("");
      const metadata = data.metadata;
      const resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      const result = resultArray[0];
      const PANEL = d3.select("#sample-metadata");
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  
  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      const samples = data.samples;
      const resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      const result = resultArray[0];
      const otu_ids = result.otu_ids;
      const otu_labels = result.otu_labels;
      const sample_values = result.sample_values;
      const bubbleLayout = {
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        height: 510,
        width: 500
      };
      const bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Rainbow"
          }
        }
      ];
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
      const yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      const barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
      const barLayout = {
        showlegend: false,
        height: 600,
        width: 1200,
        sizemode: "area",
        hovermode:"closet",
        xaxis:{title:"OTU_ID"}
      };
      Plotly.newPlot("bar", barData, barLayout);
    });
  }
  function init() {
    const selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
      const sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  init();
  