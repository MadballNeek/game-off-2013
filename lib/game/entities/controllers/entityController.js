ig.module(
        'game.entities.controllers.entityController'
    )

    .requires(
        'impact.entity'
    )

    .defines(function () {
        ig.EntityController = ig.Entity.extend({
            onPlatform: false,
            flip: false,
            jumpHeight: 125,
            accelValue: null,
            accelGround: 800,
            accelAir: 300,
            projectileYAxisOffset: 0,
            projectileLeftOffeset: 0,
            projectileRightOffset: 0,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
            },

            moveLeft: function () {
                this.accel.x = -this.accelValue;
                this.flip = true;
            },

            moveRight: function () {
                this.accel.x = this.accelValue;
                this.flip = false;
            },

            stand: function () {
                this.accel.x = 0;
            },

            jump: function () {
                if (this.standing) {
                    this.vel.y = -this.jumpHeight;
                }
            },

            stopMoving: function () {
                // Set accel to 0, over vel, to gradually stop the entity.
                this.accel.x = 0;
                this.accel.y = 0;
            },

            spawnProjectile: function (projectileToSpawn) {
                var settings = [];
                // Let the projectile know which direction we are facing.
                settings['flip'] = this.flip;
                // Let the projectile know who spawned it (this is done to prevent damaging self).
                // Once there are more entities and we setup the ig.Entity.TYPE properties, this may go away.
                settings['whoSpawned'] = this;

                var projectileOffset = this.determineProjectileOffset();

                ig.game.spawnEntity(projectileToSpawn, projectileOffset.x, projectileOffset.y, settings);
            },

            determineProjectileOffset: function () {
                var projectileOffset = {x: 0, y: 0};
                projectileOffset.y = this.pos.y + this.size.y * this.projectileYAxisOffset;
                if (this.flip) {
                    projectileOffset.x = this.pos.x - this.size.x * this.projectileLeftOffeset;
                } else {
                    projectileOffset.x = this.pos.x + this.size.x * this.projectileRightOffset;
                }

                return projectileOffset;
            },

            update: function () {
                this.accelValue = this.standing ? this.accelGround : this.accelAir;
                this.onPlatform = false;
                this.parent();
            },

            isBeingCrushed: function (axis, other) {
                var overlap;
                var size;
                if (axis === 'y') {
                    size = this.size.y;
                    if (this.pos.y < other.pos.y) {
                        overlap = this.pos.y + this.size.y - other.pos.y;
                    } else {
                        overlap = this.pos.y - (other.pos.y + other.size.y);
                    }
                } else {
                    size = this.size.x;
                    if (this.pos.x < other.pos.x) {
                        overlap = this.pos.x + this.size.x - other.pos.x;
                    } else {
                        overlap = this.pos.x - (other.pos.x + other.size.x);
                    }
                }
                overlap = Math.abs(overlap);

                return overlap > size / 2;
            },

            collideWith: function (other, axis) {
                if (other) {
                    this.onPlatform = other.name === 'elevator';
                    if (other.collides === ig.Entity.COLLIDES.FIXED && this.touches(other)) {
                        if (this.isBeingCrushed(axis, other)) {
                            this.receiveDamage(100, other);
                        }
                    }
                }
                this.parent(other, axis);
            },

            handleMovementTrace: function (res) {
                this.parent(res);
            }
        });
    });
