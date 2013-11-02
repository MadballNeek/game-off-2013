ig.module(
        'game.entities.controllers.enemyController'
    )

    .requires(
        'game.entities.controllers.entityController'
    )

    .defines(function () {
        EnemyController = ig.EntityController.extend({
            ai: null,

            setAi: function (ai) {
                this.ai = ai;
            },

            update: function () {
                this.parent();
                if (this.ai) {
                    this.ai();
                }
            }
        });
    });