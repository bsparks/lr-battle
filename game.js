'use strict';

let STATES = {
    PRESTART: 0,
    LOADED: 1,
    MENU: 2,
    PLAY: 3
};

class Game {
    constructor(canvasId, width = 800, height = 600) {
        this.canvasId = canvasId;
        this.width = width;
        this.height = height;

        this.currentState = STATES.PRESTART;
        this._started = false;

        this.input = new InputMgr(this);

        this.loader = new AssetLoader('images/');

        this.scene = new SceneObject(this);
    }

    _loop() {
        requestAnimationFrame(this._loop.bind(this));

        this.update();
        this.render();
    }

    _clear(color = '#000') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    update() {
        this.input.update();
        this.scene.update();
    }

    render() {
        this._clear();
        this.scene.render();
    }

    start() {
        if (this._started) {
            return;
        }
        this._started = true;

        this.canvas = document.getElementById(this.canvasId);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');

        this.loader.load().then(() => {
            this.currentState = STATES.LOADED;
            this._loop();
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