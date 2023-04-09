import React, { Component } from 'react';
import "./Template.css";
import { IconButton, Snackbar } from '@mui/material';
import { Fullscreen, StickyNote2, Tv } from '@mui/icons-material';
import App from './App';

export default class Template extends Component {

    mounted = false;
    state = { ready: false, fullscreen: false, showMessege: false, mode: "tv" };

    move = (e: MouseEvent) => {
        if (this.state.fullscreen) return;
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
        if(this.state.mode === "tv") {
            if(window.innerWidth >= window.innerHeight) {
                content.style.width = (0.56 * window.innerWidth) + "px";
                content.style.height = (0.28 * window.innerWidth) + "px";
                content.style.transform = `translate(-${0.003 * window.innerWidth}px, -${0.01 * window.innerWidth}px)`;
            }
            else {
                content.style.width = (0.28 * window.innerHeight) + "px";
                content.style.height = (0.56 * window.innerHeight) + "px";
                content.style.transform = `translate(-${0.01 * window.innerHeight}px, -${0.003 * window.innerHeight}px)`;
            }
        } else {
            if(window.innerWidth >= window.innerHeight) {
                content.style.width = (0.58 * window.innerWidth) + "px";
                content.style.height = (0.35 * window.innerWidth) + "px";
                content.style.transform = `translate(${0.0035 * window.innerWidth}px, ${0.01 * window.innerWidth}px)`;
            }
            else {
                content.style.width = (0.35 * window.innerHeight) + "px";
                content.style.height = (0.56 * window.innerHeight) + "px";
                content.style.transform = `translate(-${0.01 * window.innerHeight}px, -${0.003 * window.innerHeight}px)`;
            }
        }
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

    moveToNotes = () => {
        const newMode = this.state.mode === "tv" ? "notes" : "tv";
        this.setState({ ready: false, mode: newMode }, () => {
            const background = document.getElementById("background") as HTMLVideoElement;
            background.addEventListener("ended", () => {
                this.resize();
                this.setState({ ready: true });
            });
        });
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
                    <App mode={this.state.mode}></App>
                </>
            );
        }
        return (
            <div>
                <div id="background-container">
                    {/* Preload assets */}
                    <img src="/scene/3.png" height="100%" style={{ display: "none" }}></img>
                    <img src="/scene/4.png" height="100%" style={{ display: "none" }}></img>
                    {
                        this.state.ready ? (
                            <img src={this.state.mode === "tv" ? "/scene/3.png" : "/scene/4.png"} height="100%" id="background">

                            </img>
                        ) : (
                            <video height="100%" id="background" autoPlay muted>
                                <source src={this.state.mode === "tv" ? "/scene/start.mkv" : "/scene/notes.mkv"} type="video/mp4" />
                            </video>
                        )
                    }
                </div>
                <div id="content-container">
                    <div
                        onMouseMove={e => e.stopPropagation()}
                        id="content"
                        style={{ display: this.state.ready ? "block" : "none" }}>
                        <App mode={this.state.mode}></App>
                    </div>
                </div>

                <IconButton
                    onMouseMove={e => e.stopPropagation()}
                    id="fullscreen"
                    style={{ backgroundColor: "#11111177" }}
                    onClick={() => this.setState({ fullscreen: !this.state.fullscreen, showMessege: !this.state.showMessege })}>
                    <Fullscreen style={{ color: "white" }}></Fullscreen>
                </IconButton>
                <IconButton
                    onMouseMove={e => e.stopPropagation()}
                    id="notes"
                    style={{ backgroundColor: "#11111177" }}
                    onClick={this.moveToNotes}>
                        {
                            this.state.mode === "tv" ? (
                                <StickyNote2 style={{ color: "white" }}></StickyNote2>
                            ) : (
                                <Tv style={{ color: "white" }}></Tv>
                            )
                        }
                    
                </IconButton>
            </div>
        )
    }
}
