'use strict';

function pointInRect(point, rect) {
    return (rect.x <= point.x && point.x <= rect.x1 && rect.y <= point.y && point.y <= rect.y1);
}

class Sprite extends SceneObject {
    constructor(game, key, x, y, frame = 0, width = null, height = width) {
        super(game, x, y);

        this.key = key;

        this.frame = frame;
        this.width = width;
        this.height = height;

        this._renderParams = null;

        this.onLeftMouseDown = new Signal();

        game.input.onLeftMouseDown.add(() => {
            if (!this.bounds) {
                return;
            }
            let down = game.input.mouse.downPos;

            if(pointInRect(down, this.bounds)) {
                this.onLeftMouseDown.dispatch();
            }
        });
    }

    _getRenderParams() {
        let img = this.game.loader.getCache(this.key),
            params = [0, 0];

        if (this.width) {
            let cols = img.width / this.width,
                rows = img.height / this.height,
                y = Math.floor(this.frame / cols),
                x = this.frame % cols;

            let sx = x * this.width,
                sy = y * this.height,
                sw = this.width,
                sh = this.height;

            params = [sx, sy, sw, sh, 0, 0, this.width, this.height];

            console.debug(cols, rows, x, y, params);
        }

        this._renderParams = params;
    }

    update() {
        if (!this.enabled) {
            return;
        }

        let img = this.game.loader.getCache(this.key),
            width = img.width,
            height = img.height;

        if (this.width) {
            width = this.width;
            height = this.height;
        }

        this.bounds = {
            x: this.pos.x,
            y: this.pos.y,
            w: width,
            h: height,
            x1: this.pos.x + width,
            y1: this.pos.y + height
        };

        super.update();
    }

    render() {
        if (!this.enabled || !this.visible) {
            return;
        }
        let img = this.game.loader.getCache(this.key);

        if (!this._renderParams) {
            this._getRenderParams();
        }

        this.game.ctx.save();
        this.game.ctx.translate(this.pos.x, this.pos.y);
        this.game.ctx.drawImage(img, ...this._renderParams);
        this.game.ctx.restore();

        super.render();
    }
}