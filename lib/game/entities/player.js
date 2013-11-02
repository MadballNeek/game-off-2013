ig.module(
        'game.entities.player'
    )

    .requires(
        'game.system.eventChain',
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

            health: 100,
            isDead: false,
            deathEventChain: null,
            invincibleTimer: null,
            invincibleDelta: 2,

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
            },

            selectAnimation: function () {
                if (this.vel.y < 0 && !this.onPlatform) {
                    this.currentAnim = this.anims.jump;
                } else if (this.vel.y > 0 && !this.onPlatform) {
                    this.currentAnim = this.anims.fall;
                } else if (this.vel.x != 0) {
                    this.currentAnim = this.anims.run;
                } else if (!this.isDead) {
                    this.currentAnim = this.anims.idle;
                }
                this.currentAnim.flip.x = this.flip;
            },

            update: function () {
                this.selectAnimation();
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