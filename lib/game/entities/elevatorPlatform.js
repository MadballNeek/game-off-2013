ig.module(
        'game.entities.elevatorPlatform'
    )

    .requires(
        'game.system.eventChain',
        'game.entities.mover',
        'game.entities.elevatorBody'
    )

    .defines(function () {
        EntityElevatorPlatform = EntityMover.extend({
            name: 'elevator',
            size: {x: 32, y: 2},
            animSheet: new ig.AnimationSheet('media/elevatorPlatform.png', 32, 2),
            type: ig.Entity.TYPE.B,
            elevatorBody: null,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0]);
                // Weltmeister doesn't like spawnEntity calls!
                if (!ig.global.wm) {
                    this.elevatorBody = ig.game.spawnEntity(EntityElevatorBody, this.pos.x, this.pos.y, null);
                }
            },

            update: function () {
                this.parent();
                this.elevatorBody.pos.x = this.pos.x;
                var yAxisOffset = 30;
                this.elevatorBody.pos.y = this.pos.y - yAxisOffset;
            }
        });
    });