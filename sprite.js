'use strict';

class Sprite extends SceneObject {
    constructor(game, key, x, y, frame = 0, width = null, height = width) {
        super(game, x, y);

        this.key = key;

        this.frame = frame;
        this.width = width;
        this.height = height;

        this._renderParams = null;
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

    render() {
        let img = this.game.loader.getCache(this.key);

        if (!this._renderParams) {
            this._getRenderParams();
        }

        this.game.ctx.save();
        this.game.ctx.translate(this.pos.x, this.pos.y);
        this.game.ctx.drawImage(img, ...this._renderParams);
        this.game.ctx.restore();
    }
}