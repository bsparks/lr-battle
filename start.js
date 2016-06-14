'use strict';

let game = new Game('viewport');

game.loader.add('image', 'logo', 'logo1.png');

document.addEventListener('DOMContentLoaded', function() {
    game.start();
});