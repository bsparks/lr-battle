'use strict';

let game = new Game('viewport');

game.loader.add('image', 'logo', 'logo1.png');
game.loader.add('image', 'menu_icons', 'townactions.png');
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
        this.log = [];

        this.locPos = { x: 80, y: 16 };

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
            }),
            mountain: new Location({
                name: 'Grizzlebush Mountains',
                img: 'mountain',
                descr: 'Littered with scrub bushes and rocks, the mountain is home to unspeakable horrors.',
                battleMsg: 'tumbles out from behind a rock'
            }),
            shop: new Location({

            }),
            temple: new Location({

            })
        };

        this.logMsg('Welcome to Legendary Realms! v0.2-experi-alpha-dynamo');
        this.logMsg('Your travels have brought you to a land of mystery and wonder.');
        this.logMsg('It has been many moons since you left your home in search of adventure.');

        this.locSprite = this.add(new Sprite(this.game, 'town', this.locPos.x, this.locPos.y));

        this._changeLoc(this.locations.town);

        this.game.input.onLeftMouseDown.addOnce(() => {
            console.debug('game click');
            if (this.loc !== this.locations.forest) {
                this._changeLoc(this.locations.forest);
            }
        });

        let icon = this.add(new Sprite(this.game, 'menu_icons', 16, 16, 58, 32));
        icon.onLeftMouseDown.add(() => this.logMsg('clicked the hero!'));
        let text = this.add(new Text(this.game, 'Warspawn', 16, 40));
    }

    logMsg(msg) {
        this.log.push(msg);
        while (this.log.length > 10) {
            this.log.shift();
        }
    }

    _changeLoc(toLoc) {
        this.loc = toLoc;
        this.locSprite.key = toLoc.img;

        this.logMsg(`You arrive at ${toLoc.name}`);
        this.logMsg(toLoc.descr);
    }

    _renderLog() {
        let start = { x: 16, y: 512 - 96 };

        this.log.forEach((msg, i) => {
            let x = start.x;
            let y = start.y + (i * 16);

            this.game.print(x, y, msg);
        });
    }

    render() {
        super.render();

        this._renderLog();
    }
}

class TitleScene extends SceneObject {
    constructor(game) {
        super(game);

        this.init();
    }

    init() {
        this.game.input.onLeftMouseDown.addOnce(() => {
            this.game.scene = new PlayScene(game);
        });

        this.add(new Sprite(this.game, 'logo', 50, 200));
    }
}

let titleScene = new TitleScene(game);

game.scene = titleScene;

document.addEventListener('DOMContentLoaded', function() {
    game.start();
});