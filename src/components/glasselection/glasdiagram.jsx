import Plot from "react-plotly.js";


function Glasdiagram({data, glasdata, title, xAxisTitle, yAxisTitle, autorange, colorValue, isSVM}) {

    if (isSVM) {
        return (
            <Plot
                        data={[
                            {
                                x: data["x"],
                                y: data["y"],
                                z: data["z"],
                                mode: "markers",
                                type: "scatter3d",
                                text: glasdata,
                            }
                        ]}
                        layout={{paper_bgcolor: "transparent", plot_bgcolor: "white", autoscale: false, width: 620, height: 500, title: title, scene:{xaxis:{title:{text:xAxisTitle}}, yaxis:{title:{text:yAxisTitle}}, zaxis:{title:{text:"Abbenumber"}}}}}
                        />
            )   
    }
    else {
        if (colorValue) {
            return (
                <>
                    <Plot
                        data={[
                            {
                                x: data["x"],
                                y: data["y"],
                                mode: "markers",
                                type: "scatter",
                                text: glasdata,
                                marker: {
                                    color: colorValue,
                                    colorscale: [[0, 'rgb(0,0,255)'], [1, 'rgb(255,0,0)']],
                                    colorbar: {
                                        len: 1,
                                        title: "Abbenumber"
                                    }
                                }
                            }
                        ]}
                        layout={{paper_bgcolor: "transparent", plot_bgcolor: "white", autoscale: false, width: 620, height: 500, title: title, xaxis: {title: {text: xAxisTitle}, autorange: autorange}, yaxis: {title: {text: yAxisTitle}}}}
                        />
                </>
            )   
        }
        else {
            return (
                <Plot
                        data={[
                            {
                                x: data["x"],
                                y: data["y"],
                                mode: "markers",
                                type: "scatter",
                                text: glasdata,
                            }
                        ]}
                        layout={{paper_bgcolor: "transparent", plot_bgcolor: "white", autoscale: false, width: 620, height: 500, title: title, xaxis: {title: {text: xAxisTitle}, autorange: autorange}, yaxis: {title: {text: yAxisTitle}}}}
                        />
            )
        }
    }
}


export default Glasdiagram;