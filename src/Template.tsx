import React, { Component } from 'react';
import "./Template.css";
import { IconButton, Snackbar } from '@mui/material';
import { Fullscreen, StickyNote2, Tv } from '@mui/icons-material';
import App from './App';

export default class Template extends Component {

    mounted = false;
    modes: any = {
        tv: {
            staticImg: "/scene/tv_static.png",
            video: "/scene/tv_video.mkv",
            uiOffsetX: -0.003,
            uiOffsetY: -0.01,
            uiBg: "/scene/tv_bg.png",
            uiWidth: 0.56,
            uiHeight: 0.28,
            moveImg: "/scene/tv_static_1.png",
            iconToShow: <StickyNote2 style={{ color: "white" }}></StickyNote2>
        },
        notes: {
            staticImg: "/scene/notes_static.png",
            video: "/scene/notes_video.mkv",
            uiOffsetX: -0.0035,
            uiOffsetY: 0.01,
            uiBg: "/scene/notes_bg.png",
            uiWidth: 0.58,
            uiHeight: 0.35,
            moveImg: "/scene/notes_static.png",
            iconToShow: <Tv style={{ color: "white" }}></Tv>
        }
    };
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

        const currMode = this.modes[this.state.mode];
        if (window.innerWidth >= window.innerHeight) {
            content.style.width = (currMode.uiWidth * window.innerWidth) + "px";
            content.style.height = (currMode.uiHeight * window.innerWidth) + "px";
            console.log(`translate(-${currMode.uiOffsetX * window.innerWidth}px, -${currMode.uiOffsetY * window.innerWidth}px)`);
            content.style.transform = `translate(${currMode.uiOffsetX * window.innerWidth}px, ${currMode.uiOffsetY * window.innerWidth}px)`;
        }
        else {
            content.style.width = (currMode.uiHeight * window.innerHeight) + "px";
            content.style.height = (currMode.uiWidth * window.innerHeight) + "px";
            content.style.transform = `translate(${currMode.uiOffsetY * window.innerHeight}px, ${currMode.uiOffsetX * window.innerHeight}px)`;
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
        document.body.style.backgroundImage = `url(${this.modes[this.state.mode].moveImg})`;
        this.setState({ ready: false, mode: newMode }, () => {
            const background = document.getElementById("background") as HTMLVideoElement;
            background.addEventListener("ended", () => {
                document.body.style.backgroundImage = `url(${this.modes[newMode].moveImg})`;
                this.resize();
                this.setState({ ready: true }, () => {
                    const content = document.getElementById("content") as HTMLDivElement;
                    content.style.backgroundImage = `url(${this.modes[newMode].uiBg})`;
                    document.body.style.backgroundImage = "url(/scene/tv_bg.png)";
                });
            });
        });
    }

    render() {
        const currMode = this.modes[this.state.mode];
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
                    {
                        this.state.ready ? (
                            <img src={this.modes[this.state.mode].staticImg} height="100%" id="background">

                            </img>
                        ) : (
                            <video height="100%" id="background" autoPlay muted>
                                <source src={this.modes[this.state.mode].video} type="video/mp4" />
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
                        currMode.iconToShow
                    }

                </IconButton>
            </div>
        )
    }
}
