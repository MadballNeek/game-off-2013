ig.module(
        'game.screens.gameScreen'
    )
    .requires(
        'impact.game',
        'impact.font',
        'game.system.camera',
        'plugins.gamepad',
        'game.levels.proto'
    )
    .defines(function () {
        GameScreen = ig.Game.extend({
            camera: null,
            player: null,

            gravity: 500,

            // Load a font
            font: new ig.Font('media/fonts/04b03.font.png'),


            init: function () {
                this.setupCamera();
                this.bindKeys();
                this.loadLevel(LevelProto);
            },

            setupCamera: function () {
                this.camera = new Camera(ig.system.width / 2, ig.system.height / 3, 5);
                this.camera.trap.size.x = ig.system.width / 15;
                this.camera.trap.size.y = ig.system.height / 3;
                this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width / 6 : 0;
            },

            bindKeys: function () {
                ig.input.bind(ig.KEY.C, 'shoot');
                ig.input.bind(ig.KEY.D, 'grenade');
                ig.input.bind(ig.KEY.X, 'up');

                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            },

            loadLevel: function (level) {
                this.parent(level);

                this.player = this.getEntitiesByType(EntityPlayer)[0];
                this.player.zIndex = 10;

                // Set camera max and reposition trap
                this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
                this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;

                this.camera.setEntityToFollow(this.player);
            },

            update: function () {
                this.camera.update();
                this.parent();
            },

            draw: function () {
                this.camera.draw();
                this.parent();
            }
        });
    });

window.onresize = function () {
    ig.system.resize(ig.global.innerWidth * 1 * (1 / 4), ig.global.innerHeight * 1 * (1 / 4), 4);
    ig.game.camera.onWindowResize();
};
