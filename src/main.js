/*
Name:   Justin Fogo
Mod Title:  Rocket Patrol 2 (GOTY Edition)
Approx. Completion Time: _________
Mods Chosen:
    - Display the time remaining in seconds [3-pts]

    - Implement new timing/scoring mechanism [5-pts] (+2s on any successful hit; -3s on miss)
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