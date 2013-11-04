ig.module(
        'game.entities.player'
    )

    .requires(
        'game.system.eventChain',
        'game.system.stateMachine',
        'game.entities.controllers.playerController'
    )

    .defines(function () {
        EntityPlayer = PlayerController.extend({
            name: 'player',
            collides: ig.Entity.COLLIDES.PASSIVE,
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.A,

            animSheet: new ig.AnimationSheet('media/player/player.png', 16, 16),
            size: {x: 8, y: 14},
            offset: {x: 4, y: 2},

            maxVel: {x: 100, y: 300},
            friction: {x: 1000, y: 0},
            jumpHeight: 125,

            health: 100,
            isDead: false,
            deathEventChain: null,
            invincibleTimer: null,
            invincibleDelta: 2,
            stateMachine: null,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 1, [0]);
                this.addAnim('run', 0.1, [0, 1, 2, 3, 4, 5]);
                this.addAnim('jump', 1, [9]);
                this.addAnim('fall', 0.5, [6, 7]);

                this.projectileYAxisOffset = 0.5;
                this.projectileLeftOffeset = 0.9;
                this.projectileRightOffset = 1.2;

                this.currentAnim = this.anims.idle;

                this.invincibleTimer = new ig.Timer();
                this.invincibleTimer.set(this.invincibleDelta);

                this.deathEventChain = EventChain(this)
                    .then(function () {
                    })
                    .repeat();
                this.setupStateMachine();
            },

            setupStateMachine: function () {
                this.stateMachine = new StateMachine();
                var self = this;
                this.stateMachine.state('idle', {
                    enter: function () {
                        console.log("Entering idle state.");
                    },
                    update: function () {
                        if (self.vel.x != 0) {
                            self.currentAnim = self.anims.run;
                        } else if (!self.isDead) {
                            self.currentAnim = self.anims.idle;
                        }
                        if (self.vel.y > 0 && !self.onPlatform) {
                            self.currentAnim = self.anims.fall;
                        }
                    }
                });
                this.stateMachine.state('jump', {
                    enter: function () {
                        console.log("Entering jump state.");
                        self.jump();
                    },
                    update: function () {
                        if (self.vel.y < 0 && !self.onPlatform) {
                            self.currentAnim = self.anims.jump;
                        } else if (self.vel.y > 0 && !self.onPlatform) {
                            self.currentAnim = self.anims.fall;
                        }
                    }
                });
                this.stateMachine.transition('jumping', 'idle', 'jump', function () {
                    return ig.input.pressed('up') || self.gamepad.buttonReleased(self.gamepad.prevGamepadState.faceButton0,
                        self.gamepad.pad.faceButton0);
                });
                this.stateMachine.transition('standing', 'jump', 'idle', function () {
                    return self.vel.y === 0;
                });
            },

            update: function () {
                this.stateMachine.update();
                this.currentAnim.flip.x = this.flip;
                this.parent();
            },

            check: function (other) {
                if (other) {
                    if (this.invincibleTimer.delta() > 0) {
                        this.receiveDamage(other.damageAmount, other);
                        this.invincibleTimer.reset();
                    }
                }
            }
        });
    });