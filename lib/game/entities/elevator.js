ig.module(
        'game.entities.elevator'
    )

    .requires(
        'game.system.eventChain',
        'game.entities.mover'
    )

    .defines(function () {
        EntityElevator = EntityMover.extend({
            name: 'elevator',
            animSheet: new ig.AnimationSheet('media/elevatorPlatform.png', 32, 2),
            type: ig.Entity.TYPE.B,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0]);
            },

            update: function () {
                this.parent();
            }
        });
    });