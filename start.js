'use strict';

let game = new Game('viewport');

game.loader.add('image', 'logo', 'logo1.png');

game.scene.add(new Sprite(game, 'logo', 50, 200));

document.addEventListener('DOMContentLoaded', function() {
    game.start();
});