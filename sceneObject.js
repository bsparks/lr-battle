'use strict';

// base class for everything in the scene
class SceneObject {
    constructor(game, x = 0, y = 0) {
        this.game = game;

        this.pos = {x, y};

        this.children = [];

        this.enabled = true;
        this.visible = true;
    }

    add(child) {
        this.children.push(child);

        return child;
    }

    update() {
        if (!this.enabled) {
            return;
        }
        this.children.forEach(child => child.update());
    }

    render() {
        if (!this.enabled || !this.visible) {
            return;
        }

        this.game.ctx.save();
        this.game.ctx.translate(this.pos.x, this.pos.y);
        this.children.forEach(child => child.render());
        this.game.ctx.restore();
    }
}