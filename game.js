'use strict';

let STATES = {
    PRESTART: 0,
    MENU: 1,
    PLAY: 2
};

class Game {
    constructor(canvasId, width = 800, height = 600) {
        this.canvasId = canvasId;
        this.width = width;
        this.height = height;

        this.currentState = STATES.PRESTART;

        this.loader = new AssetLoader('images/');
    }

    start() {
        this.loader.load().then(() => {
            this.canvas = document.getElementById(this.canvasId);
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.ctx = this.canvas.getContext('2d');

            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.width, this.height);

            this.ctx.drawImage(this.loader.cache['logo'], 10, 10);
        }, err => console.debug(err));
    }

    print(x, y, text) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
    }
}