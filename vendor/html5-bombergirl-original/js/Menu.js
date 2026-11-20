Menu = Class.extend({
    visible: true,

    views: [],

    init: function() {
        gGameEngine.botsCount = 4;
        gGameEngine.playersCount = 0;

        this.showLoader();
    },

    show: function(text) {
        this.visible = true;

        this.draw(text);
    },

    hide: function() {
        this.visible = false;

        for (var i = 0; i < this.views.length; i++) {
            gGameEngine.stage.removeChild(this.views[i]);
        }

        this.views = [];
    },

    update: function() {
        if (this.visible) {
            for (var i = 0; i < this.views.length; i++) {
                gGameEngine.moveToFront(this.views[i]);
            }
        }
    },

    setHandCursor: function(btn) {
        btn.addEventListener('mouseover', function() {
            document.body.style.cursor = 'pointer';
        });
        btn.addEventListener('mouseout', function() {
            document.body.style.cursor = 'auto';
        });
    },

    setMode: function(mode) {
        this.hide();

        if (mode == 'single') {
            gGameEngine.botsCount = 3;
            gGameEngine.playersCount = 1;
        } else {
            gGameEngine.botsCount = 2;
            gGameEngine.playersCount = 2;
        }

        gGameEngine.playing = true;
        gGameEngine.restart();
    },

    draw: function(text) {
        var that = this;

        // semi-transparent black background
        var bgGraphics = new createjs.Graphics().beginFill("rgba(10, 15, 24, 0.85)").drawRect(0, 0, gGameEngine.size.w, gGameEngine.size.h);
        var bg = new createjs.Shape(bgGraphics);
        gGameEngine.stage.addChild(bg);
        this.views.push(bg);

        // game title
        text = text || [{text: 'Bomber', color: '#ffffff'}, {text: 'girl', color: '#ff4444'}];

        var title1 = new createjs.Text(text[0].text, "bold 32px Helvetica, Arial, sans-serif", text[0].color);
        var title2 = new createjs.Text(text[1].text, "bold 32px Helvetica, Arial, sans-serif", text[1].color);

        var titleWidth = title1.getMeasuredWidth() + title2.getMeasuredWidth();

        title1.x = gGameEngine.size.w / 2 - titleWidth / 2;
        title1.y = gGameEngine.size.h / 2 - title1.getMeasuredHeight() / 2 - 60;
        gGameEngine.stage.addChild(title1);
        this.views.push(title1);

        title2.x = title1.x + title1.getMeasuredWidth();
        title2.y = title1.y;
        gGameEngine.stage.addChild(title2);
        this.views.push(title2);

        // Action buttons
        var btnW = 140;
        var btnH = 64;
        var btnGap = 20;
        var btnY = title1.y + title1.getMeasuredHeight() + 35;

        // 1) Restart (Single Player) button
        var restartX = gGameEngine.size.w / 2 - btnW - btnGap / 2;
        var restartBgGraphics = new createjs.Graphics()
            .beginFill("rgba(16, 185, 129, 0.25)")
            .beginStroke("#10b981")
            .setStrokeStyle(2)
            .drawRoundRect(restartX, btnY, btnW, btnH, 8);
        var restartBg = new createjs.Shape(restartBgGraphics);
        gGameEngine.stage.addChild(restartBg);
        this.views.push(restartBg);
        this.setHandCursor(restartBg);

        var restartTitle = new createjs.Text("다시 시작", "bold 15px -apple-system, sans-serif", "#34d399");
        restartTitle.x = restartX + (btnW - restartTitle.getMeasuredWidth()) / 2;
        restartTitle.y = btnY + 14;
        gGameEngine.stage.addChild(restartTitle);
        this.views.push(restartTitle);

        var restartSub = new createjs.Text("[ ENTER ]", "bold 10px monospace", "#a7f3d0");
        restartSub.x = restartX + (btnW - restartSub.getMeasuredWidth()) / 2;
        restartSub.y = btnY + 38;
        gGameEngine.stage.addChild(restartSub);
        this.views.push(restartSub);

        restartBg.addEventListener('click', function() {
            that.setMode('single');
        });

        // 2) Exit to Lobby button
        var exitX = gGameEngine.size.w / 2 + btnGap / 2;
        var exitBgGraphics = new createjs.Graphics()
            .beginFill("rgba(239, 68, 68, 0.2)")
            .beginStroke("#ef4444")
            .setStrokeStyle(2)
            .drawRoundRect(exitX, btnY, btnW, btnH, 8);
        var exitBg = new createjs.Shape(exitBgGraphics);
        gGameEngine.stage.addChild(exitBg);
        this.views.push(exitBg);
        this.setHandCursor(exitBg);

        var exitTitle = new createjs.Text("대기실 나가기", "bold 15px -apple-system, sans-serif", "#f87171");
        exitTitle.x = exitX + (btnW - exitTitle.getMeasuredWidth()) / 2;
        exitTitle.y = btnY + 14;
        gGameEngine.stage.addChild(exitTitle);
        this.views.push(exitTitle);

        var exitSub = new createjs.Text("[ ESC ]", "bold 10px monospace", "#fecaca");
        exitSub.x = exitX + (btnW - exitSub.getMeasuredWidth()) / 2;
        exitSub.y = btnY + 38;
        gGameEngine.stage.addChild(exitSub);
        this.views.push(exitSub);

        exitBg.addEventListener('click', function() {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'return-to-lobby' }, '*');
            }
        });
    },

    showLoader: function() {
        var bgGraphics = new createjs.Graphics().beginFill("#000000").drawRect(0, 0, gGameEngine.size.w, gGameEngine.size.h);
        var bg = new createjs.Shape(bgGraphics);
        gGameEngine.stage.addChild(bg);

        var loadingText = new createjs.Text("Loading...", "20px Helvetica", "#FFFFFF");
        loadingText.x = gGameEngine.size.w / 2 - loadingText.getMeasuredWidth() / 2;
        loadingText.y = gGameEngine.size.h / 2 - loadingText.getMeasuredHeight() / 2;
        gGameEngine.stage.addChild(loadingText);
        gGameEngine.stage.update();
    }
});