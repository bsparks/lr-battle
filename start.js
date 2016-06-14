'use strict';

let game = new Game('viewport');

game.loader.add('image', 'logo', 'logo1.png');
// locations
game.loader.add('image', 'town', 'town.gif');
game.loader.add('image', 'shop', 'shop.gif');
game.loader.add('image', 'forest', 'forest.bmp');
game.loader.add('image', 'mountain', 'mountain.jpg');
game.loader.add('image', 'church', 'church.gif');
// monsters
game.loader.add('image', 'kobold', 'kobold.gif');
game.loader.add('image', 'snake', 'snake.gif');
game.loader.add('image', 'spider', 'spider.gif');
game.loader.add('image', 'skeleton', 'skeleton.gif');
game.loader.add('image', 'mantis', 'mantis.gif');
game.loader.add('image', 'plant', 'plant.gif');
// items
game.loader.add('image', 'chest', 'chest.gif');
game.loader.add('image', 'potion_red', 'potion_red.gif');
game.loader.add('image', 'potion_yellow', 'potion_yellow.gif');
// npcs
game.loader.add('image', 'shopkeep', 'shopkeep.gif');
game.loader.add('image', 'priest', 'priest.gif');

class PlayScene extends SceneObject {
    constructor(game) {
        super(game);

        this.init();
    }

    init() {
        this.locPos = {x: 80, y: 16};

        this.locations = {
            town: new Location({
                name: 'The Town',
                img: 'town',
                descr: 'Bustling and booming the town is full of life.',
                battleMsg: 'steps out from a back alley'
            }),
            forest: new Location({
                name: 'The Dark Wood',
                img: 'forest',
                descr: 'Overgrown and ancient, the woods holds many dark and mysterious secrets',
                battleMsg: 'leaps from the trees'
            })
        };

        this.locSprite = this.add(new Sprite(this.game, 'town', this.locPos.x, this.locPos.y));
    }

    update() {
        let mouse = this.game.input.mouse;
        if (mouse.left.down && mouse.left.duration > 5) {
            console.debug('mouse', mouse.left.duration);
            this.locSprite.key = 'forest';
        }
    }
}

let playScene = new PlayScene(game);

let titleScene = new SceneObject(game);
titleScene.add(new Sprite(game, 'logo', 50, 200));
titleScene.update = function() {
    let input = this.game.input;
    if (input.mouse.left.down) {
        this.game.scene = playScene;
    }
};

game.scene = titleScene;

document.addEventListener('DOMContentLoaded', function() {
    game.start();
});