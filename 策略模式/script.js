'use strict';
//========================================策略模式============================================
(function() {
    let strategies = {
        'S': function(salary) {
            return salary * 4;
        },
        'A': function(salary) {
            return salary * 3;
        },
        'B': function(salary) {
            return salary * 2;
        },
    };

    let calculateBonus = function(level, salary) {
        console.log(strategies[level](salary));
    }

    console.log('=======js版本策略模式===========');
    console.log(calculateBonus('A', 200));
    console.log(calculateBonus('S', 200));
})();

(function() {

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

    var div = document.getElementById('div');
    var animate = new Animate(div);
    animate.start('left', 500, 2000, 'strongEaseOut');
    // animate.start( 'top', 1500, 500, 'strongEaseIn' );
})();

(function() {
    var strategies = {
        isNonEmpty: function(value, errorMsg) {
            if (value === '') {
                return errorMsg;
            }
        },
        minLength: function(value, length, errorMsg) {
            if (value.length < length) {
                return errorMsg;
            }
        },
        isMobile: function(value, errorMsg) {
            if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
                return errorMsg;
            }
        }
    };
    /***********************Validator 类**************************/
    var Validator = function() {
        this.cache = [];
    };
    Validator.prototype.add = function(dom, rules) {
        var self = this;
        for (var i = 0, rule; rule = rules[i++];) {
            (function(rule) {
                var strategyAry = rule.strategy.split(':');
                var errorMsg = rule.errorMsg;
                self.cache.push(function() {
                    var strategy = strategyAry.shift();
                    strategyAry.unshift(dom.value);
                    strategyAry.push(errorMsg);
                    return strategies[strategy].apply(dom, strategyAry);
                });
            })(rule)
        }
    };
    Validator.prototype.start = function() {
        for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
            var errorMsg = validatorFunc();
            if (errorMsg) {
                return errorMsg;
            }
        }
    };
    /***********************客户调用代码**************************/
    var registerForm = document.getElementById('registerForm');
    var validataFunc = function() {
        var validator = new Validator();
        validator.add(registerForm.userName, [{
            strategy: 'isNonEmpty',
            errorMsg: '用户名不能为空'
        }, {
            strategy: 'minLength:6',
            errorMsg: '用户名长度不能小于 10 位'
        }]);
        validator.add(registerForm.password, [{
            strategy: 'minLength:6',
            errorMsg: '密码长度不能小于 6 位'
        }]);
        validator.add(registerForm.phoneNumber, [{
            strategy: 'isMobile',
            errorMsg: '手机号码格式不正确'
        }]);
        var errorMsg = validator.start();
        return errorMsg;
    }
    registerForm.onsubmit = function() {
        var errorMsg = validataFunc();
        if (errorMsg) {
            alert(errorMsg);
            return false;
        }
    };
})();
