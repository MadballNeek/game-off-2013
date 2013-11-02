ig.module(
        'game.system.gamepadControllable'
    )

    .requires(
        'plugins.gamepad'
    )

    .defines(function () {
        GamepadControllable = ig.Class.extend({
            pad: null,
            prevGamepadState: null,

            init: function () {
                this.pad = Gamepad.getState(0);
                if (this.pad == null) {
                    this.pad = 0;
                }
                // Obtain previous gamepad state so we can properly perform "on button release" actions.
                this.prevGamepadState = Gamepad.getPreviousState(0);
                if (this.prevGamepadState == null) {
                    this.prevGamepadState = 0;
                }
            },

            buttonReleased: function (prevGamePadStateButton, currGamePadStateButton) {
                return prevGamePadStateButton == 0 && currGamePadStateButton == 1;
            },

            update: function () {
                this.pad = Gamepad.getState(0);
                if (this.pad == null) {
                    this.pad = 0;
                }
                // Obtain previous gamepad state so we can properly perform "on button release" actions.
                this.prevGamepadState = Gamepad.getPreviousState(0);
                if (this.prevGamepadState == null) {
                    this.prevGamepadState = 0;
                }
            }
        });
    });
