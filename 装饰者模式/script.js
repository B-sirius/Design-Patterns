'use strict';
(() => {
    Function.prototype.after = function(afterfn) {
        let _self = this; // 保存原函数的引用
        return function() { // 返回包含了原函数和新函数的"代理函数"
            /*执行新函数,且保证this不被劫持,新函数接受的参数
            也会被原封不动地传入原函数*/
            let ret = _self.apply(this, arguments);
            afterfn.apply(this, arguments);
            return ret;
        }
    };

    let showLogin = function() {
        console.log('打开登录浮层');
    };

    let log = function() {
        console.log('上报标签为:' + this.getAttribute('tag'));
    }

    showLogin = showLogin.after(log); // 打开登录浮层后上报数据
    document.getElementById('button').onclick = showLogin;
})();
