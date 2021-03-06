ig.module(
        'game.entities.abstract.projectile'
    )

    .requires(
        'impact.entity',
        'impact.entity-pool',
        'game.system.eventChain'
    )

    .defines(function () {
        EntityProjectile = ig.Entity.extend({
            collides: ig.Entity.COLLIDES.LITE,
            checkAgainst: ig.Entity.TYPE.A,
            maxVel: {x: 500, y: 500},
            accelAir: 500,
            decayEventChain: null,
            decayTime: 1,
            damageAmount: 10,
            parentSpawned: null,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                // Who spawned this?
                this.parentSpawned = settings['whoSpawned'];
                // A projectile should decay away if it doesn't collide with anything.
                this.decayEventChain = EventChain(this)
                    .wait(this.decayTime)
                    .then(this.kill)
                    .repeat();
                // Give a projectile a default starting velocity.
                this.vel.x = (settings['flip'] ? -this.maxVel.x : this.maxVel.x);
                this.vel.y = 0;
            },

            update: function () {
                this.decayEventChain();
                this.parent();
            },

            check: function (other) {
                // Don't apply damage to the entity that spawned this projectile.
                if (other && other !== this.parentSpawned) {
                    other.receiveDamage(this.damageAmount, this);
                }
                this.parent(other);
            }
        });
        ig.EntityPool.enableFor(EntityProjectile);
    });