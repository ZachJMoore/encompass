import React, { Component } from 'react';
import './App.css';
import Camera from "./components/Camera";
let ColorScheme = require("color-scheme");

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      imageData: {
        image: "",
        rgb: {r: 255, g: 255, b: 255}
      },
      colorPalette: []
    }

    this.updateState = (object) =>{
      // this.setState({imageData: object})
      this.setState(object)
    }
    this.updateColorPalette = (array)=>{
      this.setState({colorPalette: array})
    }

    this.getPalette = (hex)=>{
      return new Promise((res, rej)=>{

        let scheme = new ColorScheme();
        scheme.from_hex(hex)
        console.log(scheme.colors())
        res(scheme.colors())



        // let url = "http://colormind.io/api/"
        // let data = {
        //   model: "ui",
        //   input: [
        //     "N",
        //     "N",
        //     [r, g, b],
        //     "N",
        //     "N"
        //   ]
        // }
        // fetch(url, {
        //   body: JSON.stringify(data),
        //   headers: {
        //     "Content-Type": "application/x-www-form-urlencoded"
        //   },
        //   method: "POST"
        // })
        // .then(res=>res.json())
        // .then(data=>res(data))
        // .catch(err=>rej(err))

      })
      
    }

  }

  render() {
    return (
      <div className="app flex-container full-width column" style={{"background":`linear-gradient(145deg, #${this.state.colorPalette[0]}, #${this.state.colorPalette[2]})`}}>

        <section className="viewport-container flex-container flex-strech">
          <Camera updateState={this.updateState} getPalette={this.getPalette} updateColorPalette={this.updateColorPalette} />
        </section>

        <section className="captured-image-container flex-container flex-strech column">
          {this.state.colorPalette.length === 0 ? <p className="info-tag">Try taking a picture or scannning an Encompass QR code</p>: <p className="info-tag">Average color collected</p>}
          
          <section className="flex-container flex-strech">
            <img className="captured-image" src={this.state.imageData.image.src}/>
            <div className="average-color-swatch" style={{"backgroundColor": `rgb(${this.state.imageData.rgb.r}, ${this.state.imageData.rgb.g}, ${this.state.imageData.rgb.b})`}} />
          </section>
        </section>

        <section className="color-palette-container flex-container flex-strech column">
          {this.state.colorPalette.length !== 0 && <p className="info-tag">Similar colors</p>}
          <section className="flex-container flex-strech">
            {this.state.colorPalette.map((color, i)=>{
              return (<div className="color-palette-swatch" key={i} style={{backgroundColor: `#${color}`}} />)
            })}
            {console.log(this.state.colorPalette)}
          </section>
        </section>
      </div>
    );
  }
}

export default App;
