/*
Name:   Justin Fogo
Mod Title:  Rocket Patrol 2 (GOTY Edition)
Approx. Completion Time: _________
Mods Chosen:
    [1-pts]:
    - Allow player to control rocket after it's been fired
    - Implement speed increase after 30-seconds

    [3-pts]:
    - Display the time remaining in seconds
    - 4 new explosion sfx that randomizes which one is played on impact

    [5-pts]:
    - Implement new timing/scoring mechanism (+2s on any successful hit; -3s on miss)
    - Create new enemy spaceship type that's smaller, faster, and worth more points 
*/

'use strict'

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3