'use strict';

class Text extends SceneObject {
    constructor(game, text, x, y) {
        super(game, x, y);

        this.text = text;
    }

    render() {
        if (!this.enabled || !this.visible) {
            return;
        }

        this.game.ctx.save();
        this.game.ctx.translate(this.pos.x, this.pos.y);
        this.game.ctx.fillStyle = '#fff';
        this.game.ctx.fillText(this.text, 0, 0);
        this.game.ctx.restore();

        super.render();
    }
}