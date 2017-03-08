'use strict';
//================9.3======================
(() => {
    let button1 = document.getElementById('btn1');

    let MenuBar = {
        refresh: function() {
            console.log('刷新菜单界面');
        }
    };

    let RefreshMenuBarCommand = function(receiver) {
        return {
            excute: function() {
                receiver.refresh();
            }
        };
    };

    let setCommand = function(button, command) {
        button.onclick = function() {
            command.excute();
        }
    };

    let refreshMenuBarCommand = new RefreshMenuBarCommand(MenuBar);
    setCommand(button1, refreshMenuBarCommand);
})();

//=================9.4=====================
(() => {

    let ball = document.getElementById('ball');
    let pos = document.getElementById('pos');
    let moveBtn = document.getElementById('moveBtn');
    let cancelBtn = document.getElementById('cancelBtn');

    let MoveCommand = function(receiver, pos, oldPos) {
        this.receiver = receiver;
        this.pos = pos;
        this.oldPos = oldPos
    };

    MoveCommand.prototype.excute = function() {
        this.receiver.start('left', this.pos, 3000, 'strongEaseOut');
        this.oldPos = this.receiver.dom.getBoundingClientRect()[this.receiver.propertyName]; // 记录小球开始移动前的位置
    };

    MoveCommand.prototype.undo = function() {
        this.receiver.start('left', this.oldPos, 3000, 'strongEaseOut');
    }

    let moveCommand;

    moveBtn.onclick = function() {
        let animate = new Animate(ball);
        moveCommand = new MoveCommand(animate, pos.value);
        moveCommand.excute();
    };

    cancelBtn.onclick = function() {
        moveCommand.undo();
    }

    //缓动算法，参数分别是 已消耗时间, 起始位置， 位置变化量， 持续时间；返回的是当前位置
    var tween = {
        linear: function(t, b, c, d) {
            return c * t / d + b;
        },
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        strongEaseIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        strongEaseOut: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        sineaseIn: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        sineaseOut: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        }
    };

    let Animate = function(dom) {
        this.dom = dom;
        this.startTime = 0; //开始时间
        this.startPos = 0; //起始位置
        this.endPos = 0; //结束位置
        this.propertyName = null; //dom节点需要被改变的属性名
        this.easing = null; //采用的缓动算法
        this.duration = null; //持续时间
    }

    Animate.prototype.start = function(propertyName, endPos, duration, easing) {
        this.startTime = +new Date;
        this.startPos = this.dom.getBoundingClientRect()[propertyName]; // dom 节点初始位置
        this.propertyName = propertyName; // dom 节点需要被改变的 CSS 属性名
        this.endPos = endPos; // dom 节点目标位置
        this.duration = duration;
        // 动画持续事件
        this.easing = tween[easing]; // 缓动算法
        let self = this;
        self.step();
    };

    Animate.prototype.step = function() {
        let t = +new Date;
        if (t >= this.startTime + this.duration) {
            this.update(this.endPos);
            return false;
        }
        let pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
        this.update(pos);
        let self = this;
        requestAnimationFrame(function() {
            self.step.apply(self);
        });
    };

    Animate.prototype.update = function(pos) {
        this.dom.style[this.propertyName] = pos + 'px';
    };
})();

//================================9.5=============================================
(() => {
    let Ryu = {
        attack: function() {
            console.log('攻击');
        },
        defense: function() {
            console.log('防御');
        },
        jump: function() {
            console.log('跳跃');
        },
        crouch: function() {
            console.log('蹲下');
        },
    };

    let makeCommand = function(receiver, state) {
        return function() {
            receiver[state]();
        }
    };

    let commands = {
        '119': 'jump', // W
        '115': 'crouch', // A
        '97': 'defense', // S
        '100': 'attack' // D
    };

    let commandStack = []; // 保存命令的堆栈

    document.onkeypress = function(ev) {
        let keyCode = ev.keyCode,
            command = makeCommand(Ryu, commands[keyCode]);

        if (command) {
            command();
            commandStack.push(command); // 将刚刚执行的命令存入堆栈
        }
    };

    document.getElementById('replay').onclick = function() {
        let command;
        while(command = commandStack.shift()) { // 从堆栈中取出命令执行
            command();
        }
    };
})();

//=============================9.7============================
(() => {
    let closeDoorCommand = {
        excute: () => {
            console.log('关门');
        }
    };

    let openPcCommand = {
        excute: () => {
            console.log('开电脑');
        }
    };

    let openQQCommand = {
        excute: () => {
            console.log('登录QQ');
        }
    };

    let MacroCommand = function() {
        return {
            commandsList: [],
            add: function(command) {
                this.commandsList.push(command);
            },
            excute: function() {
                for (let i = 0; i < this.commandsList.length; i++) {
                    this.commandsList[i].excute();
                }
            }
        }
    };

    let macroCommand = new MacroCommand();
    macroCommand.add(closeDoorCommand);
    macroCommand.add(openPcCommand);
    macroCommand.add(openQQCommand);
    macroCommand.excute();
})();
