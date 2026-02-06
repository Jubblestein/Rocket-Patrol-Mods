class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, velocity_add, shipDirection) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)                        // add to existing scene
        this.points = pointValue                        // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed + velocity_add // spaceship speed in pixels/frame plus any extra velocity
        this.direction = shipDirection
    }

    update() {
        if (!this.direction) {
            // move spaceship right
            this.x += this.moveSpeed

            // wrap from right to left edge
            if (this.x >= game.config.width) {
                this.x = 0 - this.width
            }
        }

        if (this.direction) {
            // move spaceship left
            this.x -= this.moveSpeed

            // wrap from left to right edge
            if(this.x <= 0 - this.width) {
                this.x = game.config.width
            }
        }
    }

    // reset position
    reset() {
        if (!this.direction) {
            this.x = 0 - this.width
        }

        if (this.direction) {
            this.x = game.config.width
        }
    }
}