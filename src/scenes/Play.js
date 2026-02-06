class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*5 + borderPadding*2, 'spaceship', 0, 30, 0, 1).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*6 + borderPadding*4, 'spaceship', 0, 20, 0, 1).setOrigin(0, 0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*7 + borderPadding*6, 'spaceship', 0, 10, 0, 1).setOrigin(0, 0)
        // added new smaller ship
        this.ship04 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'small-spaceship', 0, 50, 1, 1).setOrigin(0, 0)
        
        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        // initialize temporary variable for playing random explosion sfx
        this.chooseExplosion = 0
        
        // initialize score
        this.p1Score = 0

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)

        // GAME OVER flag
        this.gameOver = false

        // 60-second play clock
        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).
            setOrigin(0.5)
            this.gameOver = true
        }, null, this)

        // increase spaceship speed after 30-seconds
        this.speedUp = this.time.delayedCall(30000, () => {
            this.ship01.moveSpeed += 1
            this.ship02.moveSpeed += 1
            this.ship03.moveSpeed += 1
            this.ship04.moveSpeed += 1
        }, null, this)

        // initialize remaining time in seconds
        this.remainingTime = 0

        // Time added to clock on hits
        this.timeAdd = 2000
        // Time subtracted from clock on misses
        this.timeSub = 3000
        
        // display timer (similar to scoreConfig)
        let timerConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 70
        }
        this.displayTimer = this.add.text(game.config.width - (borderUISize + borderPadding) - timerConfig.fixedWidth, // displays timer on right-hand side of the screen in green UI box
            borderUISize + borderPadding*2, this.remainingTime, timerConfig)
    }

    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
        }
        
        this.starfield.tilePositionX -= 4

        // updates display timer each frame
        this.remainingTime = this.clock.getRemainingSeconds()
        this.displayTimer.text = Math.floor(this.remainingTime)

        if(!this.gameOver) {
            this.p1Rocket.update()  // update rocket sprite        
            this.ship01.update()    // update spaceships (x3)
            this.ship02.update()
            this.ship03.update()
            this.ship04.update()    // update small spaceship
        }

        // check if rocket misses; subtracts time from clock
        if(this.p1Rocket.missed) {
            this.clock.delay -= this.timeSub
            this.p1Rocket.missed = false
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
            this.clock.delay += this.timeAdd
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
            this.clock.delay += this.timeAdd
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
            this.clock.delay += this.timeAdd
        }
        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship04)
            this.clock.delay += this.timeAdd
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB (Axis-Aligned Bounding Boxes) checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true
        } else {
            return false
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0)
        boom.anims.play('explode')              // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset()                        // reset ship position
            ship.alpha = 1                      // make ship visible again
            boom.destroy()                      // remove explosion sprite
        })
        // score add and text update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score

        this.chooseExplosion = Phaser.Math.RND.integerInRange(1, 4) // picks random int to append to each key
        this.sound.play('sfx-explosion0' + this.chooseExplosion) // plays random explosion sfx
    }
}