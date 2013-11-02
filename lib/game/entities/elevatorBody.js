ig.module(
        'game.entities.elevatorBody'
    )

    .requires(
    )

    .defines(function () {
        EntityElevatorBody = ig.Entity.extend({
            name: 'elevator',
            animSheet: new ig.AnimationSheet('media/elevator.png', 32, 32),
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.FIXED,
            size: {x: 32, y: 2},

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0]);
                this.zIndex = -10;
            },

            update: function () {
                this.parent();
            }
        });
    });