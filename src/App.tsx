import React, { Component } from 'react';
import "./App.css";
import Home from './pages/Home';
import { IconButton, Snackbar } from '@mui/material';
import { Fullscreen } from '@mui/icons-material';

export default class App extends Component {

    mounted = false;
    isMouseInsideContent = false;
    state = { ready: false, fullscreen: false, showMessege: false };

    move = (e: MouseEvent) => {
        if (this.state.fullscreen) return;
        if (this.isMouseInsideContent) return;
        const background = document.getElementById("background") as HTMLVideoElement;
        if (!background) return;
        const content = document.getElementById("content") as HTMLDivElement;
        const speed = 25;
        const dx = speed * (e.offsetX / window.innerWidth);
        const dy = speed * (e.offsetY / window.innerHeight);
        background.style.transform = `
            translate(calc(-50%), calc(-50% + ${dy}px))
        `;
        background.style.height = `calc(100% + ${dy}px)`;
        content.style.marginTop = dy + "px";
    }

    resize = () => {
        if (this.state.fullscreen) return;
        const content = document.getElementById("content") as HTMLDivElement;
        content.style.width = (0.56 * window.innerWidth) + "px";
        content.style.height = (0.28 * window.innerWidth) + "px";
        content.style.transform = `translate(-${0.003 * window.innerWidth}px, -${0.01 * window.innerWidth}px)`;
    }

    componentDidMount(): void {
        if (this.mounted) return;
        const background = document.getElementById("background") as HTMLVideoElement;
        background.addEventListener("ended", () => {
            this.setState({ ready: true });
        });
        window.addEventListener("resize", this.resize);
        window.addEventListener("mousemove", this.move);
        window.addEventListener("keydown", e => {
            if (e.key === "Escape") {
                this.setState({ fullscreen: false }, () => {
                    this.resize();
                });
            }
        });

        this.resize();
        this.mounted = true;
    }

    render() {
        if (this.state.fullscreen) {
            return (
                <>
                    <Snackbar 
                        open={this.state.showMessege} 
                        autoHideDuration={2000} 
                        message="Press Escape to exit full screen" 
                        onClose={() => this.setState({ showMessege: false })} />
                    <Home></Home>
                </>
            );
        }
        return (
            <div>
                <div id="background-container">
                    {/* Preload the image */}
                    <img src="/scene/3.png" height="100%" style={{ display: "none" }}></img>
                    {
                        this.state.ready ? (
                            <img src="/scene/3.png" height="100%" id="background">

                            </img>
                        ) : (
                            <video height="100%" id="background" autoPlay muted>
                                <source src="/scene/start.mkv" type="video/mp4" />
                            </video>
                        )
                    }
                </div>
                <div id="content-container">
                    <div
                        id="content"
                        style={{ display: this.state.ready ? "block" : "none" }}
                        onMouseOver={() => this.isMouseInsideContent = true}
                        onMouseLeave={() => this.isMouseInsideContent = false}>
                        <Home></Home>
                    </div>
                </div>

                <IconButton
                    id="fullscreen"
                    style={{ backgroundColor: "#11111177" }}
                    onClick={() => this.setState({ fullscreen: !this.state.fullscreen, showMessege: !this.state.showMessege })}>
                    <Fullscreen style={{ color: "white" }}></Fullscreen>
                </IconButton>
            </div>
        )
    }
}
