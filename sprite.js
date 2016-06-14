'use strict';

class Sprite extends SceneObject {
    constructor(game, key, x, y) {
        super(game, x, y);

        this.key = key;
    }

    render() {
        let img = this.game.loader.getCache(this.key);

        this.game.ctx.save();
        this.game.ctx.translate(this.pos.x, this.pos.y);
        this.game.ctx.drawImage(img, 0, 0);
        this.game.ctx.restore();
    }
}