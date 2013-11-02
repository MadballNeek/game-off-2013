ig.module(
        'game.entities.spike'
    )

    .requires(
        'game.system.eventChain',
        'game.entities.controllers.enemyController'
    )

    .defines(function () {
        EntitySpike = EnemyController.extend({
            name: 'spike',
            collides: ig.Entity.COLLIDES.PASSIVE,
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.A,

            animSheet: new ig.AnimationSheet('media/spike.png', 16, 9),
            size: {x: 15, y: 7},
            offset: {x: 1, y: 2},
            flip: false,

            maxVel: {x: 50, y: 300},
            friction: {x: 1000, y: 0},
            accelGround: 25,
            accelAir: 25,

            health: 50,
            damageAmount: 10,
            isDead: false,
            deathEventChain: null,
            ai: null,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 1, [0]);
                this.addAnim('run', 0.1, [0, 1, 2]);

                this.currentAnim = this.anims.idle;

                this.isDead = false;

                this.deathEventChain = EventChain(this)
                    .then(function () {
                        this.isDead = true;
                    })
                    .repeat();

                this.ai = EventChain(this)
                    .then(function () {
                        this.moveLeft();
                    })
                    .wait(Math.random() * (5 - 2) + 2)
                    .then(function () {
                        this.moveRight();
                    })
                    .wait(Math.random() * (5 - 2) + 2)
                    .then(function () {
                        this.stand()
                    })
                    .wait(Math.random() * (5 - 2) + 2)
                    .repeat();
                this.setAi(this.ai);
            },

            selectAnimation: function () {
                if (this.vel.x != 0) {
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

            ready: function () {
                this.isDead = false;
            },

            kill: function () {
                this.deathEventChain();
                this.parent();
            }
        });
    });