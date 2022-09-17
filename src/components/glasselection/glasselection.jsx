import React, { useEffect, useState } from "react";
import axios from "axios";
import Glasdiagram from "./glasdiagram";
import { InputNumber, Select, Card, Button, Input, Image, Switch } from 'antd';
import "./styles.css";
import dichromasie from "../../images/dichromasie.png";
import trichromasie from "../../images/trichromasie.png";
import polychromasie from "../../images/polychromasie.png";

const { Option } = Select;

function Glasselection() {

    const [plotDataAbbe, setPlotDataAbbe] = useState({});
    const [showSVM, setShowSVM] = useState(false);
    const [plotDataPartialDispersion1, setPlotDataPartialDispersion1] = useState({});
    const [plotDataPartialDispersion2, setPlotDataPartialDispersion2] = useState({})
    const [plotDataSVM, setPlotDataSVM] = useState({});
    const [lambdas, setLambdas] = useState([435.8343, 486.1327, 587.5618, 656.281, 800]);
    const [transmission, setTransmission] = useState(["t546", "0.9"]);
    const [glasForCalculation, setGlasForCalculation] = useState([]);
    const [chromasieConditions, setChromasieConditions] = useState([]);
    const [numberOfLenses, setNumberOfLenses] = useState(2);
    const [glasData, setGlasdata] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchSchottGlasses, setFetchSchottGlasses] = useState(true);
    const [fetchOharaGlasses, setFetchOharaGlasses] = useState(false);

    const transmission_wavelengths = [<Option key={1} value="t2500">2500nm</Option>, <Option key={2} value="t2325">2325nm</Option>, <Option key={3} value="t1970">1970nm</Option>, <Option key={4} value="t1530">1530nm</Option>, <Option key={5} value="t1060">1060nm</Option>, <Option key={6} value="t700">700nm</Option>, <Option key={7} value="t660">660nm</Option>, <Option key={8} value="t620">620nm</Option>, <Option key={9} value="t580">580nm</Option>, <Option key={10} value="t546">546nm</Option>, <Option key={11} value="t500">500nm</Option>, <Option key={12} value="t460">460nm</Option>, <Option key={13} value="t436">436nm</Option>, <Option key={14} value="t405">405nm</Option>, <Option key={15} value="t400">400nm</Option>, <Option key={16} value="t390">390nm</Option>, <Option key={17} value="t380">380nm</Option>, <Option key={18} value="t370">370nm</Option>, <Option key={19} value="t365">365nm</Option>, <Option key={20} value="t350">350nm</Option>, <Option key={21} value="t334">334nm</Option>, <Option key={22} value="t320">320nm</Option>, <Option key={23} value="t310">310nm</Option>, <Option key={24} value="t300">300nm</Option>, <Option key={25} value="t290">290nm</Option>, <Option key={26} value="t280">280nm</Option>, <Option key={27} value="t270">270nm</Option>, <Option key={28} value="t260">260nm</Option>, <Option key={29} value="t250">250nm</Option>];
    
    const fetchGlases = async () => {
        try {
            setError(false);
            setLoading(true);

            if (fetchSchottGlasses && !fetchOharaGlasses) {
            
                // asking server for glasdata and getting response
                const response = await axios.get("http://127.0.0.1:5000/schott/" + transmission[0] + "," + transmission[1]);
                const glasdata = response.data;
               
                let glasnames = [];
                let plot_data_for_abbe_diagram = {"x": [], "y": []};
                let plot_data_for_partial_dispersion_diagram_1 = {"x": [], "y": []};
                let plot_data_for_partial_dispersion_diagram_2 = {"x": [], "y": []};
                let plot_data_for_svm = {"x": [], "y": [], "z": []};

                // loop through all glasses and calculate the indizes at given lambdas and also abbe number and partial dispersion
                for (let key in glasdata) {

                    // from the response extracting the sellmeier coefficients
                    let B1 = glasdata[key][0];
                    let B2 = glasdata[key][1];
                    let B3 = glasdata[key][2];
                    let C1 = glasdata[key][3];
                    let C2 = glasdata[key][4];
                    let C3 = glasdata[key][5];

                    // calculating indizes with the sellmeier equation
                    let indizes = [];
                    for (let i = 0; i <= 4; i++) {
                        indizes[i] = Math.pow((1 + ((B1 * Math.pow(lambdas[i] / 1000, 2)) / (Math.pow(lambdas[i] / 1000, 2) - C1)) + ((B2 * Math.pow(lambdas[i] / 1000, 2)) / (Math.pow(lambdas[i] / 1000, 2) - C2)) + ((B3 * Math.pow(lambdas[i] / 1000, 2)) / (Math.pow(lambdas[i] / 1000, 2) - C3))), 0.5);
                    }

                    // calculating abbe number
                    let abbe_number = (indizes[2] - 1) / (indizes[1] - indizes[3]);
                    plot_data_for_abbe_diagram["x"].push(abbe_number);
                    plot_data_for_abbe_diagram["y"].push(indizes[2]);

                    // calculating partial dispersion 1
                    let partial_dispersion_1 = (indizes[0] - indizes[1]) / (indizes[1] - indizes[3]);
                    plot_data_for_partial_dispersion_diagram_1["x"].push(abbe_number);
                    plot_data_for_partial_dispersion_diagram_1["y"].push(partial_dispersion_1);

                    // calculating partial dispersion 2
                    let partial_dispersion_2 = (indizes[1] - indizes[4]) / (indizes[1] - indizes[3]);
                    plot_data_for_partial_dispersion_diagram_2["x"].push(partial_dispersion_1);
                    plot_data_for_partial_dispersion_diagram_2["y"].push(partial_dispersion_2);

                    // calculating data for svm diagram
                    plot_data_for_svm["x"].push(partial_dispersion_1);
                    plot_data_for_svm["y"].push(partial_dispersion_2);
                    plot_data_for_svm["z"].push(abbe_number);

                    // storing the glasname separately
                    glasnames.push(key);
                }
                // setting the state variables
                setPlotDataAbbe(plot_data_for_abbe_diagram);
                setPlotDataPartialDispersion1(plot_data_for_partial_dispersion_diagram_1);
                setPlotDataPartialDispersion2(plot_data_for_partial_dispersion_diagram_2);
                setPlotDataSVM(plot_data_for_svm);
                setGlasdata(glasnames);
                setLoading(false);
            }

            if (fetchOharaGlasses && !fetchSchottGlasses) {
                // asking server for glasdata and getting response
                const response = await axios.get("http://127.0.0.1:5000/ohara/" + transmission[0] + "," + transmission[1]);
                const glasdata = response.data;
                
                let glasnames = [];
                let plot_data_for_abbe_diagram = {"x": [], "y": []};
                let plot_data_for_partial_dispersion_diagram_1 = {"x": [], "y": []};
                let plot_data_for_partial_dispersion_diagram_2 = {"x": [], "y": []};
                let plot_data_for_svm = {"x": [], "y": [], "z": []};

                // loop through all glasses and calculate the indizes at given lambdas and also abbe number and partial dispersion
                for (let key in glasdata) {

                    // from the response extracting the sellmeier coefficients
                    let A1 = glasdata[key][0];
                    let A2 = glasdata[key][1];
                    let A3 = glasdata[key][2];
                    let B1 = glasdata[key][3];
                    let B2 = glasdata[key][4];
                    let B3 = glasdata[key][5];

                    // calculating indizes with the sellmeier equation
                    let indizes = [];
                    for (let i = 0; i <= 4; i++) {
                        indizes[i] = Math.pow((1 + ((A1 * Math.pow(lambdas[i] / 1000, 2)) / (Math.pow(lambdas[i] / 1000, 2) - B1)) + ((A2 * Math.pow(lambdas[i] / 1000, 2)) / (Math.pow(lambdas[i] / 1000, 2) - B2)) + ((A3 * Math.pow(lambdas[i] / 1000, 2)) / (Math.pow(lambdas[i] / 1000, 2) - B3))), 0.5);
                    }

                    // calculating abbe number
                    let abbe_number = (indizes[2] - 1) / (indizes[1] - indizes[3]);
                    plot_data_for_abbe_diagram["x"].push(abbe_number);
                    plot_data_for_abbe_diagram["y"].push(indizes[2]);

                    // calculating partial dispersion 1
                    let partial_dispersion_1 = (indizes[0] - indizes[1]) / (indizes[1] - indizes[3]);
                    plot_data_for_partial_dispersion_diagram_1["x"].push(abbe_number);
                    plot_data_for_partial_dispersion_diagram_1["y"].push(partial_dispersion_1);

                    // calculating partial dispersion 2
                    let partial_dispersion_2 = (indizes[1] - indizes[4]) / (indizes[1] - indizes[3]);
                    plot_data_for_partial_dispersion_diagram_2["x"].push(partial_dispersion_1);
                    plot_data_for_partial_dispersion_diagram_2["y"].push(partial_dispersion_2);

                    // calculating data for svm diagram
                    plot_data_for_svm["x"].push(partial_dispersion_1);
                    plot_data_for_svm["y"].push(partial_dispersion_2);
                    plot_data_for_svm["z"].push(abbe_number);

                    // storing the glasname separately
                    glasnames.push(key);
                }
                // setting the state variables
                setPlotDataAbbe(plot_data_for_abbe_diagram);
                setPlotDataPartialDispersion1(plot_data_for_partial_dispersion_diagram_1);
                setPlotDataPartialDispersion2(plot_data_for_partial_dispersion_diagram_2);
                setPlotDataSVM(plot_data_for_svm);
                setGlasdata(glasnames);
                setLoading(false);
            }

            if (fetchSchottGlasses && fetchOharaGlasses) {
                // asking server for glasdata and getting response
                const response_ohara = await axios.get("http://127.0.0.1:5000/ohara/" + transmission[0] + "," + transmission[1]);
                const glasdata_ohara = response_ohara.data;
                
                const response_schott = await axios.get("http://127.0.0.1:5000/schott/" + transmission[0] + "," + transmission[1]);
                const glasdata_schott = response_schott.data;
                
                const glasdata = Object.assign({}, glasdata_ohara, glasdata_schott);

                let glasnames = [];
                let plot_data_for_abbe_diagram = {"x": [], "y": []};
                let plot_data_for_partial_dispersion_diagram_1 = {"x": [], "y": []};
                let plot_data_for_partial_dispersion_diagram_2 = {"x": [], "y": []};
                let plot_data_for_svm = {"x": [], "y": [], "z": []};

                // loop through all glasses and calculate the indizes at given lambdas and also abbe number and partial dispersion
                for (let key in glasdata) {

                    // from the response extracting the sellmeier coefficients
                    let A1 = glasdata[key][0];
                    let A2 = glasdata[key][1];
                    let A3 = glasdata[key][2];
                    let B1 = glasdata[key][3];
                    let B2 = glasdata[key][4];
                    let B3 = glasdata[key][5];

                    // calculating indizes with the sellmeier equation
                    let indizes = [];
                    for (let i = 0; i <= 4; i++) {
                        indizes[i] = Math.pow((1 + ((A1 * Math.pow(lambdas[i] / 1000, 2)) / (Math.pow(lambdas[i] / 1000, 2) - B1)) + ((A2 * Math.pow(lambdas[i] / 1000, 2)) / (Math.pow(lambdas[i] / 1000, 2) - B2)) + ((A3 * Math.pow(lambdas[i] / 1000, 2)) / (Math.pow(lambdas[i] / 1000, 2) - B3))), 0.5);
                    }

                    // calculating abbe number
                    let abbe_number = (indizes[2] - 1) / (indizes[1] - indizes[3]);
                    plot_data_for_abbe_diagram["x"].push(abbe_number);
                    plot_data_for_abbe_diagram["y"].push(indizes[2]);

                    // calculating partial dispersion 1
                    let partial_dispersion_1 = (indizes[0] - indizes[1]) / (indizes[1] - indizes[3]);
                    plot_data_for_partial_dispersion_diagram_1["x"].push(abbe_number);
                    plot_data_for_partial_dispersion_diagram_1["y"].push(partial_dispersion_1);

                    // calculating partial dispersion 2
                    let partial_dispersion_2 = (indizes[1] - indizes[4]) / (indizes[1] - indizes[3]);
                    plot_data_for_partial_dispersion_diagram_2["x"].push(partial_dispersion_1);
                    plot_data_for_partial_dispersion_diagram_2["y"].push(partial_dispersion_2);

                    // calculating data for svm diagram
                    plot_data_for_svm["x"].push(partial_dispersion_1);
                    plot_data_for_svm["y"].push(partial_dispersion_2);
                    plot_data_for_svm["z"].push(abbe_number);

                    // storing the glasname separately
                    glasnames.push(key);
                }
                // setting the state variables
                setPlotDataAbbe(plot_data_for_abbe_diagram);
                setPlotDataPartialDispersion1(plot_data_for_partial_dispersion_diagram_1);
                setPlotDataPartialDispersion2(plot_data_for_partial_dispersion_diagram_2);
                setPlotDataSVM(plot_data_for_svm);
                setGlasdata(glasnames);
                setLoading(false);
            }

            if (!fetchOharaGlasses && !fetchSchottGlasses) {
                    // setting the state variables
                    setPlotDataAbbe([]);
                    setPlotDataPartialDispersion1([]);
                    setPlotDataPartialDispersion2([]);
                    setPlotDataSVM([]);
                    setGlasdata([]);
                    setLoading(false);        
            }

        } catch (error) {
            setError(true);
        }
    }

    useEffect(() => {
        fetchGlases();
        console.log("Hallo von useEffect");
        console.log(fetchSchottGlasses);
        console.log(fetchOharaGlasses);
        
    }, [lambdas, transmission, fetchOharaGlasses, fetchSchottGlasses]);

    const onChangeInputWavelength = (value, lambda) => {
        let newLambdas = [];
        newLambdas = lambdas;
        newLambdas[lambda] = value;
        setLambdas([...newLambdas]);
    }

    const onChangeInputTransissionWavelength = (value) => {
        let newTransmission = transmission;
        newTransmission[0] = value;
        setTransmission([...newTransmission]);
    }

    const onChangeInputTransmission = (value) => {
        let newTransmission = transmission;
        newTransmission[1] = value.toString();
        setTransmission([...newTransmission]);
    }

    const userGlasselection = async (value, glasNumber) => {
        const glas_name = value.target.value;
        let glassesForCalculation = glasForCalculation;
        glassesForCalculation[glasNumber] = glas_name;

        //console.log(glassesForCalculation);

        //check if any glases have blank values and eventually remove them
        for (let i = 0; i < glassesForCalculation.length; i++) {
            if (glassesForCalculation[i] === "") {
                glassesForCalculation.splice(i, 1);
            }
        }
        setGlasForCalculation([...glassesForCalculation]);

        let abbeNumberForCalculation = [];
        let partialDispersionsForCalculation_1 = [];
        let partialDispersionsForCalculation_2 = [];

        if (glasForCalculation.length > 0) {
            
            for (let i = 0; i < glasForCalculation.length; i++) {
                try {
                    setError(false);
                    setLoading(true); 
                                                                
                    // asking server for glasdata and getting response
                    const response = await axios.get("http://127.0.0.1:5000/" + glasForCalculation[i]);
                    const glasdata = response.data;
                  
                    if (glasdata[glasForCalculation[i]]) {
                        console.log(glasdata[glasForCalculation[i]])
                        // from the response extracting the sellmeier coefficients
                        let B1 = glasdata[glasForCalculation[i]][0];
                        let B2 = glasdata[glasForCalculation[i]][1];
                        let B3 = glasdata[glasForCalculation[i]][2];
                        let C1 = glasdata[glasForCalculation[i]][3];
                        let C2 = glasdata[glasForCalculation[i]][4];
                        let C3 = glasdata[glasForCalculation[i]][5];
        
                        // calculating indizes with the sellmeier equation
                        let indizes = [];
                        for (let i = 0; i <= 4; i++) {
                            indizes[i] = Math.pow((1 + ((B1 * Math.pow(lambdas[i] / 1000, 2)) / (Math.pow(lambdas[i] / 1000, 2) - C1)) + ((B2 * Math.pow(lambdas[i] / 1000, 2)) / (Math.pow(lambdas[i] / 1000, 2) - C2)) + ((B3 * Math.pow(lambdas[i] / 1000, 2)) / (Math.pow(lambdas[i] / 1000, 2) - C3))), 0.5);
                        }
        
                        // calculating abbe number
                        let abbe_number = (indizes[2] - 1) / (indizes[1] - indizes[3]);

                        console.log(abbe_number);
                            
                        // calculating partial dispersion 1
                        let partial_dispersion_1 = (indizes[0] - indizes[1]) / (indizes[1] - indizes[3]);
                            
                        // calculating partial dispersion 2
                        let partial_dispersion_2 = (indizes[1] - indizes[4]) / (indizes[1] - indizes[3]);

                        abbeNumberForCalculation[i] = abbe_number;
                        partialDispersionsForCalculation_1[i] = partial_dispersion_1;
                        partialDispersionsForCalculation_2[i] = partial_dispersion_2;
                    }
                } catch (error) {
                    setError(true);
                }
                // Singlet
                if (abbeNumberForCalculation.length === 1) {
                    // calculating refractive powers and condition or dichromsie
                    let dichromasie_condition = (1 / abbeNumberForCalculation[0]);
                    let trichromasie_condition = (partialDispersionsForCalculation_1[0] * 1 / abbeNumberForCalculation[0]); 
                    let polychromasie_condition = (partialDispersionsForCalculation_2[0] * 1 / abbeNumberForCalculation[0]); 

                    let chromasie = chromasieConditions;
                    chromasie[0] = dichromasie_condition.toString();
                    chromasie[1] = trichromasie_condition.toString();
                    chromasie[2] = polychromasie_condition.toString();
                    setChromasieConditions([...chromasie]);
                }
                // Doublet
                else if (abbeNumberForCalculation.length === 2) {
                    console.log("dichromat");
                    // calculating refractive powers and condition or dichromsie
                    let total_power_1 = 1 / (1 - abbeNumberForCalculation[1] / abbeNumberForCalculation[0]);
                    let total_power_2 = - (abbeNumberForCalculation[1] / abbeNumberForCalculation[0]) / (1 - abbeNumberForCalculation[1] / abbeNumberForCalculation[0]);
                    let dichromasie_condition = (total_power_1 / abbeNumberForCalculation[0]) + (total_power_2 / abbeNumberForCalculation[1]);
                    let trichromasie_condition = (partialDispersionsForCalculation_1[0] * total_power_1 / abbeNumberForCalculation[0]) + (partialDispersionsForCalculation_1[1] * total_power_2 / abbeNumberForCalculation[1]); 
                    let polychromasie_condition = (partialDispersionsForCalculation_2[0] * total_power_1 / abbeNumberForCalculation[0]) + (partialDispersionsForCalculation_2[1] * total_power_2 / abbeNumberForCalculation[1]); 

                    let chromasie = chromasieConditions;
                    chromasie[0] = dichromasie_condition.toString();
                    chromasie[1] = trichromasie_condition.toString();
                    chromasie[2] = polychromasie_condition.toString();
                    setChromasieConditions([...chromasie]);
                }
                // Triplet
                else if (abbeNumberForCalculation.length === 3) {
                    // calculating refractive powers and condition or dichromsie
                    let N = abbeNumberForCalculation[0] * (partialDispersionsForCalculation_1[2] - partialDispersionsForCalculation_1[1]) + abbeNumberForCalculation[1] * (partialDispersionsForCalculation_1[0] - partialDispersionsForCalculation_1[2]) + abbeNumberForCalculation[2] * (partialDispersionsForCalculation_1[1] - partialDispersionsForCalculation_1[0]);
                    let total_power_1 = (abbeNumberForCalculation[0] * (partialDispersionsForCalculation_1[2] - partialDispersionsForCalculation_1[1])) / N;
                    let total_power_2 = - (abbeNumberForCalculation[1] * (partialDispersionsForCalculation_1[0] - partialDispersionsForCalculation_1[2])) / N;
                    let total_power_3 = - (abbeNumberForCalculation[2] * (partialDispersionsForCalculation_1[1] - partialDispersionsForCalculation_1[0])) / N;
                    let dichromasie_condition = (total_power_1 / abbeNumberForCalculation[0]) + (total_power_2 / abbeNumberForCalculation[1]) + (total_power_3 / abbeNumberForCalculation[2]);
                    let trichromasie_condition = (partialDispersionsForCalculation_1[0] * total_power_1 / abbeNumberForCalculation[0]) + (partialDispersionsForCalculation_1[1] * total_power_2 / abbeNumberForCalculation[1]) + (partialDispersionsForCalculation_1[2] * total_power_3 / abbeNumberForCalculation[2]); 
                    let polychromasie_condition = (partialDispersionsForCalculation_2[0] * total_power_1 / abbeNumberForCalculation[0]) + (partialDispersionsForCalculation_2[1] * total_power_2 / abbeNumberForCalculation[1]) + (partialDispersionsForCalculation_2[2] * total_power_3 / abbeNumberForCalculation[2]); 

                    let chromasie = chromasieConditions;
                    chromasie[0] = dichromasie_condition.toString();
                    chromasie[1] = trichromasie_condition.toString();
                    chromasie[2] = polychromasie_condition.toString();
                    setChromasieConditions([...chromasie]);
                }
            }
        }
    }

    const changeNumberOfLenses = (action) => {
        if (action === "add") {
            setNumberOfLenses(3);
        }
        else {
            let glassesForCalculation = glasForCalculation;
            glassesForCalculation.pop();
            setGlasForCalculation([...glassesForCalculation]);
            setNumberOfLenses(2);
        }
    }

    return (
        <>
            {plotDataAbbe && 
                <div>
                    <div>
                        <Switch checkedChildren="Schott" unCheckedChildren="Schott" defaultChecked onChange={()=>setFetchSchottGlasses(!fetchSchottGlasses)}/>
                        <Switch checkedChildren="Ohara" unCheckedChildren="Ohara" onChange={()=>setFetchOharaGlasses(!fetchOharaGlasses)}/>
                        <Switch checkedChildren="S-V-M Diagram" unCheckedChildren="S-V-M Diagram" onChange={() => setShowSVM(!showSVM)}/>
                    </div>
                    <div>
                        <Glasdiagram data={plotDataAbbe} title={"Abbediagram"} glasdata={glasData} xAxisTitle={"Abbenumber"} yAxisTitle={"Refractive Index"} autorange={"reversed"}/>
                        <Glasdiagram data={plotDataPartialDispersion1} title={"Partial dispersion diagram"} glasdata={glasData} xAxisTitle={"Abbenumber"} yAxisTitle={"Partial Dispersion"} autorange={"reversed"}/>
                        {showSVM ?  <Glasdiagram data={plotDataSVM} title={"Steinich-Völker-Mehnert-Diagram"} glasdata={glasData} xAxisTitle={"Partial dispersion"} yAxisTitle={"Partial Dispersion"} autorange={true} colorValue={plotDataAbbe["x"]} isSVM={true}/> :
                                    <Glasdiagram data={plotDataPartialDispersion2} title={"Partial dispersion - Partial dispersion diagram"} glasdata={glasData} xAxisTitle={"Partial dispersion"} yAxisTitle={"Partial Dispersion"} autorange={true} colorValue={plotDataAbbe["x"]}/>
                        }
                     </div>
                     <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{width: "50%", padding: "15px"}}>
                            <Card title="Choose a minimal transmission value for your preferred wavelength">
                                <table className="myTable">
                                    <thead>
                                        <tr>
                                            <th>Wavelength</th>
                                            <th>Transmission</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td> <Select defaultValue={"t546"} onChange={onChangeInputTransissionWavelength}> {transmission_wavelengths} </Select></td>
                                            <td> <InputNumber defaultValue={"0.9"} onChange={onChangeInputTransmission}/></td> 
                                        </tr>
                                    </tbody>
                                </table>
                            </Card>
                            <Card title= "Choose the spectral range [nm] in which your lens should work">
                            <table className="myTable">
                                <thead className="myTableHead">
                                    <tr className="myTrHead">
                                        <th className="myTh">Wavelength 1</th>
                                        <th className="myTh">Wavelength 2</th>
                                        <th className="myTh">Wavelength 3</th>
                                        <th className="myTh">Wavelength 4</th>
                                        <th className="myTh">Wavelength 5</th>
                                    </tr>
                                </thead>
                                <tbody className="myTableBody">
                                    <tr className="myTrBody">
                                        <td className="myTd"><InputNumber value={lambdas[0]} onChange={(value) => onChangeInputWavelength(value, 0)}/></td>
                                        <td className="myTd"><InputNumber value={lambdas[1]} onChange={(value) => onChangeInputWavelength(value, 1)}/></td>
                                        <td className="myTd"><InputNumber value={lambdas[2]} onChange={(value) => onChangeInputWavelength(value, 2)}/></td>
                                        <td className="myTd"><InputNumber value={lambdas[3]} onChange={(value) => onChangeInputWavelength(value, 3)}/></td>
                                        <td className="myTd"><InputNumber value={lambdas[4]} onChange={(value) => onChangeInputWavelength(value, 4)}/></td> 
                                    </tr>
                                </tbody>
                            </table>
                            </Card>
                        </div>
                        <div style={{width: "50%", padding: "15px"}}>
                            <Card title={
                                <div className="myDiv">
                                    Calculations
                                    { numberOfLenses === 2 ? <Button type="primary" size="small" onClick={() => changeNumberOfLenses("add")}>Add one lens</Button>:
                                    
                                    <Button type="primary" size="small" onClick={() => changeNumberOfLenses("remove")}>Remove one lens</Button>}
                                </div>}>
                                {numberOfLenses === 2 ? 

                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        <Input placeholder="Glas 1" onChange={(value) => userGlasselection(value, 0)} />
                                        <Input placeholder="Glas 2" onChange={(value) => userGlasselection(value, 1)} />
                                    </div> :
                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        <Input placeholder="Glas 1" onChange={(value) => userGlasselection(value, 0)} />
                                        <Input placeholder="Glas 2" onChange={(value) => userGlasselection(value, 1)} />
                                        <Input placeholder="Glas 3" onChange={(value) => userGlasselection(value, 2)} />
                                    </div>                                
                                }
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div>
                                                    Achromatic Condition
                                                    <Image width={40} src={dichromasie}/>
                                                </div>
                                            </td>
                                            <td>{chromasieConditions[0]}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div>
                                                    Apochromatic Condition
                                                    <Image width={50} src={trichromasie}/>
                                                </div>
                                            </td>
                                            <td>{chromasieConditions[1]}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div>
                                                    Polychromatic Condition
                                                    <Image width={50} src={polychromasie}/>
                                                </div>
                                            </td>
                                            <td>{chromasieConditions[2]}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                     </div>
                </div>       
            }
        </>
    )
}

export default Glasselection;


//<Slider min={250} max={2500} range value={[lambdas[0], lambdas[3]]} onChange={onChangeSlider}/>