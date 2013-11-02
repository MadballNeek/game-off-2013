ig.module(
        'game.entities.controllers.playerController'
    )

    .requires(
        'game.entities.controllers.entityController',
        'game.system.gamepadControllable',
        'game.entities.weapons.ammo.bullet'
    )

    .defines(function () {
        PlayerController = ig.EntityController.extend({
            gamepad: null,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.gamepad = new GamepadControllable();
            },

            move: function () {
                if (ig.input.state('left') || this.gamepad.pad.dpadLeft == 1) {
                    this.moveLeft();
                } else if (ig.input.state('right') || this.gamepad.pad.dpadRight == 1) {
                    this.moveRight();
                } else {
                    this.stand();
                }

                if (ig.input.pressed('up') || this.gamepad.buttonReleased(this.gamepad.prevGamepadState.faceButton0, this.gamepad.pad.faceButton0)) {
                    this.jump();
                }
            },

            shoot: function () {
                if (ig.input.released('shoot') || this.gamepad.buttonReleased(this.gamepad.prevGamepadState.faceButton2, this.gamepad.pad.faceButton2)) {
                    this.spawnProjectile(EntityBullet);
                } else if (ig.input.released('grenade') || this.gamepad.buttonReleased(this.gamepad.prevGamepadState.faceButton1, this.gamepad.pad.faceButton1)) {
                    this.spawnProjectile(EntityGrenade);
                }
            },

            update: function () {
                this.parent();
                this.gamepad.update();
                this.shoot();
                this.move();
            }
        });
    });
