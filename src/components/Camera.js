import React, { Component } from "react"
// import * as Instascan from "../instascan"
// import * as Instascan from "instascan"
let Instascan = window.Instascan

class Camera extends Component{
    constructor(props){
        super(props);
        this.state = {}
        this.camera = 0
        this.handleButton = ()=>{
            let previewImage = this.refs.preview

            let image = function getScreenshot(videoEl = previewImage, scale = 1) {
                scale = scale || 1;
            
                const canvas = document.createElement("canvas");
                canvas.width = videoEl.clientWidth * scale;
                canvas.height = videoEl.clientHeight * scale;
                canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);
                const width = canvas.width;
                const height = canvas.height;
                const ctx = canvas.getContext("2d");

                let imageData = ctx.getImageData(0, 0, width, height);
                let data = imageData.data;
                let r = 0;
                let g = 0;
                let b = 0;

                for (let i = 0, l = data.length; i < l; i += 4) {
                    r += data[i];
                    g += data[i+1];
                    b += data[i+2];
                }

                r = Math.floor(r / (data.length / 4));
                g = Math.floor(g / (data.length / 4));
                b = Math.floor(b / (data.length / 4));

                let rgb = {}
                rgb["r"] = r
                rgb["g"] = g
                rgb["b"] = b

                let rgbToHex = (r, g, b) => {
                    if (r > 255 || g > 255 || b > 255)
                        return "ffffff"
                    return ((r << 16) | (g << 8) | b).toString(16);
                }

                const image = new Image()
                image.src = canvas.toDataURL();
                return {
                    image: image,
                    rgb: rgb,
                    rgbText: `(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                    hexText: `${rgbToHex(r, g, b)}`
                };
            }
            let imageData = image()

            console.log(imageData)

            this.props.getPalette(imageData.hexText)
            .then(data=>{
                this.props.updateState({
                    imageData: imageData,
                    colorPalette: data
                })
            })
            
        };
        this.scanner = ()=>{}
        this.startCameraZero = (scanner)=>{
            Instascan.Camera.getCameras().then(function (cameras) {
                if (cameras.length > 0) {
                    console.log(cameras)
                    scanner.start(cameras[0]);
                } else {
                    console.error('No cameras found.');
                }
            }).catch(function (e) {
                console.error(e);
            });
        }
        this.initCamera = (mirror, startCamera)=>{
            let self = this
            let scanner = new Instascan.Scanner({video: this.refs.preview, captureImage: true, mirror: mirror});
            this.setState({scanner: scanner})
            this.scanner = scanner;
            scanner.addListener('scan', function (content) {
                console.log(typeof content)
                let meta = JSON.parse(content)

                if (meta.verify !== "encompass") {
                    alert("Not a valid qr")
                    return
                }

                let rgb = meta.rgb
                
                let imageData = {
                    image: "",
                    rgb: {r: rgb.r, g: rgb.g, b: rgb.b}
                  };

                let rgbToHex = (r, g, b) => {
                    if (r > 255 || g > 255 || b > 255)
                        return "ffffff"
                    return ((r << 16) | (g << 8) | b).toString(16);
                }

                self.props.getPalette(rgbToHex(rgb.r, rgb.g, rgb.b))
                .then(data=>{
                    self.props.updateState({imageData: imageData, colorPalette: data})
                })
                console.log(content);
            });
            startCamera(scanner)
        }
        this.switchCamera = ()=>{
            this.scanner.stop()
            let self = this
            let toggleCamera = ()=>{
               Instascan.Camera.getCameras().then(function (cameras) {
                if (cameras.length > 0) {
                    console.log(cameras)
                    if(self.camera === 0 && cameras.length > 0){
                        self.camera = 1;
                        self.state.scanner.start(cameras[1])
                    } else {
                        self.camera = 0;
                        self.state.scanner.start(cameras[0])
                    }
                } else {
                    console.error('No cameras found.');
                }
                }).catch(function (e) {
                    console.error(e);
                }); 
            }
            this.initCamera(false, toggleCamera)
        }
    }
    componentDidMount(){
        this.initCamera(true, this.startCameraZero);
    }

    render(){
        return(<div className="flex-container flex-strech column">
            <button className="viewport-change-camera" onClick={this.switchCamera}>«»</button>
            <video className="viewport" ref="preview"></video>
            <button className="viewport-shutter" onClick={this.handleButton}>Capture</button>
        </div>)
    }
}

export default Camera