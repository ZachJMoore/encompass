import React, { Component } from 'react';
import './App.css';
import Camera from "./components/Camera"

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

    this.getColorMindPalette = (r, g, b)=>{
      return new Promise((res, rej)=>{

        let url = "http://colormind.io/api/"
        let data = {
          model: "ui",
          input: [
            "N",
            "N",
            [r, g, b],
            "N",
            "N"
          ]
        }
        fetch(url, {
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST"
        })
        .then(res=>res.json())
        .then(data=>res(data))
        .catch(err=>rej(err))

      })
      
    }

  }

  render() {
    return (
      <div className="App flex-container full-width column">

        <section className="viewport-container flex-container flex-strech">
          <Camera updateState={this.updateState} getColorMindPalette={this.getColorMindPalette} updateColorPalette={this.updateColorPalette} />
        </section>

        <section className="captured-image-container flex-container flex-strech column">
          {this.state.colorPalette.length === 0 ? <p className="info-tag">Try taking a picture or scannning an Encompass QR code</p>: <p className="info-tag">Average color collected</p>}
          
          <section className="flex-container flex-strech">
            <img className="captured-image" src={this.state.imageData.image.src}/>
            <div className="average-color-swatch" style={{"backgroundColor": `rgb(${this.state.imageData.rgb.r}, ${this.state.imageData.rgb.g}, ${this.state.imageData.rgb.b})`}} />
          </section>
        </section>

        <section className="color-palette-container flex-container flex-strech column">
          {this.state.colorPalette.length !== 0 && <p className="info-tag">Suggested colors to match with</p>}
          <section className="flex-container flex-strech">
            {this.state.colorPalette.map((color, i)=>{
              return (<div className="color-palette-swatch" key={i} style={{backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`}} />)
            })}
            {console.log(this.state.colorPalette)}
          </section>
        </section>
      </div>
    );
  }
}

export default App;
