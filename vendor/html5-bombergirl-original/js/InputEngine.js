InputEngine = Class.extend({
    /**
     * A dictionary mapping ASCII key codes to string values describing
     * the action we want to take when that key is pressed.
     */
    bindings: {},

    /**
     * A dictionary mapping actions that might be taken in our game
     * to a boolean value indicating whether that action is currently being performed.
     */
    actions: {},

    listeners: [],

    init: function() {
    },

    setup: function() {
        this.bind(38, 'up');
        this.bind(37, 'left');
        this.bind(40, 'down');
        this.bind(39, 'right');
        this.bind(32, 'bomb');
        this.bind(18, 'bomb');

        this.bind(87, 'up2');
        this.bind(65, 'left2');
        this.bind(83, 'down2');
        this.bind(68, 'right2');
        this.bind(16, 'bomb2');

        this.bind(13, 'restart');
        this.bind(27, 'escape');
        this.bind(77, 'mute');

        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);

        // Forwarded keyboard inputs from parent platform iframe shell
        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'bombergirl-key') {
                var fakeEvent = {
                    keyCode: Number(event.data.keyCode),
                    preventDefault: function() {}
                };
                if (event.data.down) {
                    gInputEngine.onKeyDown(fakeEvent);
                } else {
                    gInputEngine.onKeyUp(fakeEvent);
                }
            }
        });
    },

    onKeyDown: function(event) {
        var action = gInputEngine.bindings[event.keyCode];
        if (action) {
            gInputEngine.actions[action] = true;
            if (action.endsWith('2') && (!window.gGameEngine || gGameEngine.playersCount <= 1)) {
                var base = action.slice(0, -1);
                gInputEngine.actions[base] = true;
            }
            if (event.preventDefault) event.preventDefault();
        }
        return false;
    },

    onKeyUp: function(event) {
        var action = gInputEngine.bindings[event.keyCode];
        if (action) {
            gInputEngine.actions[action] = false;
            if (action.endsWith('2') && (!window.gGameEngine || gGameEngine.playersCount <= 1)) {
                var base = action.slice(0, -1);
                gInputEngine.actions[base] = false;
            }

            var listeners = gInputEngine.listeners[action];
            if (listeners) {
                for (var i = 0; i < listeners.length; i++) {
                    var listener = listeners[i];
                    listener();
                }
            }
            if (event.preventDefault) event.preventDefault();
        }
        return false;
    },

    /**
     * The bind function takes an ASCII keycode and a string representing
     * the action to take when that key is pressed.
     */
    bind: function(key, action) {
        this.bindings[key] = action;
    },

    addListener: function(action, listener) {
        this.listeners[action] = this.listeners[action] || new Array();
        this.listeners[action].push(listener);
    },

    removeAllListeners: function() {
        this.listeners = [];
    }
});

gInputEngine = new InputEngine();