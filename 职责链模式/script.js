'use strict';
//====================================13.4===================================
(() => {
    let order500 = function(orderType, pay, stock) {
        if (orderType === 1 && pay === true) {
            console.log('500元定金预购，得到100元优惠券');
        } else {
            return 'nextSuccessor'; // 不知道下一个节点是啥，往后传递就是了
        }
    }

    let order200 = function(orderType, pay, stock) {
        if (orderType === 2 && pay === true) {
            console.log('200元定金预购，得到50优惠券');
        } else {
            return 'nextSuccessor';
        }
    }

    let orderNormal = function(orderType, pay, stock) {
        if (stock > 0) {
            console.log('普通购买，无优惠券');
        } else {
            console.log('手机库存不足');
        }
    }

    let Chain = function(fn) {
    	this.fn = fn; // 调用的方法
    	this.successor = null; // 下一个节点
    };

    Chain.prototype.setNextSuccessor = function(successor) {
    	return this.successor = successor;
    };

    Chain.prototype.passRequest = function() {
    	let ret = this.fn.apply(this, arguments);

    	if (ret === 'nextSuccessor') {
    		return this.successor && this.successor.passRequest.apply(this.successor, arguments);
    	}

    	return ret;
    }

    // 将订单函数包装成职责链的节点
    let chainOrder500 = new Chain(order500);
    let chainOrder200 = new Chain(order200);
    let chainOrderNormal = new Chain(orderNormal);
    // 指定顺序
    chainOrder500.setNextSuccessor(chainOrder200);
    chainOrder200.setNextSuccessor(chainOrderNormal);

    chainOrder500.passRequest(1, true, 500);
    chainOrder500.passRequest(2, true, 500);

})();

//=============================3.2.3 && 13.7============================
(() => {
	Function.prototype.before = function(beforefn) {
		let _self = this;
		return function() {
			beforefn.apply(this, arguments);
			return _self.apply(this, arguments);
		}
	}

	Function.prototype.after = function(afterfn) {
		let _self = this;
		return function() {
			let ret = _self.apply(this, arguments); // 执行时，最先执行，而此时_self就是上面的return 的 function
			afterfn.apply(this, arguments);
			return ret;
		}
	};

	let func = function() {
		console.log(2);
	};

	let func2 = func.before(function() {
		console.log(1);
	}).after(() => {
		console.log(3);
	});

	func2();
})();

(() => {
	Function.prototype.after = function(fn) {
		let self = this;
		return function() {
			let ret = self.apply(this, arguments);
			if (ret === 'nextSuccessor') {
				return fn.apply(this, arguments);
			}

			return ret;
		}
	};

	let order500 = function(orderType, pay, stock) {
        if (orderType === 1 && pay === true) {
            console.log('500元定金预购，得到100元优惠券');
        } else {
            return 'nextSuccessor'; // 不知道下一个节点是啥，往后传递就是了
        }
    };

    let order200 = function(orderType, pay, stock) {
        if (orderType === 2 && pay === true) {
            console.log('200元定金预购，得到50优惠券');
        } else {
            return 'nextSuccessor';
        }
    };

    let orderNormal = function(orderType, pay, stock) {
        if (stock > 0) {
            console.log('普通购买，无优惠券');
        } else {
            console.log('手机库存不足');
        }
    };

    let order = order500.after(order200).after(orderNormal);

    order(3, true, 500);
})();