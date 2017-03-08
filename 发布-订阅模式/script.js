'use strict';

//=======================================8.4===================================
// (() => {
// 	let salesOffices = {}; // 定义售楼处

// 	salesOffices.clientList = {}; // 缓存列表，存放订阅者的回调函数

// 	salesOffices.listen = function(key, fn) {
// 		if (!this.clientList[key]) {
// 			this.clientList[key] = [];
// 		}
// 		this.clientList[key].push(fn);
// 	};

// 	salesOffices.trigger = function(...values) {
// 		let key = values.shift(values), // 取出消息类型
// 			fns = this.clientList[key]; // 取出该消息对应的回调函数集合

// 		if (!fns || fns.length === 0) {
// 			return false;
// 		}

// 		for (let i = 0, fn; fn = fns[i++]; ) {
// 			fn(...values);
// 		}
// 	};

// 	salesOffices.listen('small', (price) => { // 小明订阅small信息
// 		// console.log('价格' + price);
// 	});

// 	salesOffices.listen('big', (price) => { // 小红订阅big信息
// 		// console.log('价格' + price);
// 	});

// 	salesOffices.trigger('small', '200w'); //发布small信息
// 	salesOffices.trigger('big', '3000w'); //发布big信息
// })();

// //==================================8.6========================================
// (() => {
// 	let event = {
// 		clientList: [],
// 		listen: function(key, fn) {
// 			if (!this.clientList[key]) {
// 				this.clientList[key] = [];
// 			}
// 			this.clientList[key].push(fn); // 订阅的消息添加进缓存列表
// 		},
// 		trigger: function(...values) {
// 			let key = values.shift(),
// 				fns = this.clientList[key];

// 			if (!fns || fns.length === 0) { // 如果没有绑定对应的消息
// 				return false;
// 			}

// 			for (let i = 0, fn; fn = fns[i++]; ) {
// 				fn(...values);
// 			}
// 		},
// 		remove: function(key, fn) {
// 			let fns = this.clientList[key];
// 			if (!fns) {
// 				return false;
// 			}
// 			if (!fn) { // 如果没有传入具体的回调函数，表示需要取消key对应消息的所有订阅
// 				fns && (fns.length = 0);
// 			} else {
// 				for (let i = fns.length - 1; i >= 0; i--) { // 反向遍历，因为要进行删除操作
// 					let _fn = fns[i];
// 					if (_fn === fn) {
// 						fns.splice(i, 1); // 删除订阅者的回调函数
// 					}
// 				}
// 			}
// 		}
// 	};

// 	// 用于给对象动态安装发布订阅功能
// 	let installEvent = function(obj) {
// 		for (let i in event) {
// 			obj[i] = event[i];
// 		}
// 	};

// 	let salesOffices = {};
// 	installEvent(salesOffices);

// 	let fn1 = (price) => {
// 		console.log('肯太罗价格= ' + price);
// 	};

// 	let fn2 = (price) => {
// 		console.log('皮卡丘价格= ' + price);
// 	};

// 	let fn3 = (price) => {
// 		console.log('喵喵价格= ' + price);
// 	};

// 	salesOffices.listen('神奇宝贝邪恶贩卖场', fn1);

// 	salesOffices.listen('神奇宝贝邪恶贩卖场', fn2);

// 	salesOffices.listen('神奇宝贝邪恶贩卖场', fn3);

// 	salesOffices.remove('神奇宝贝邪恶贩卖场', fn1);

// 	salesOffices.trigger('神奇宝贝邪恶贩卖场', '3000w');
// })();

// //==========================================8.9============================
// (() => {
// 	let event = {
// 		clientList: [],
// 		listen: function(key, fn) {
// 			if (!this.clientList[key]) {
// 				this.clientList[key] = [];
// 			}
// 			this.clientList[key].push(fn); // 订阅的消息添加进缓存列表
// 		},
// 		trigger: function(...values) {
// 			let key = values.shift(),
// 				fns = this.clientList[key];

// 			if (!fns || fns.length === 0) { // 如果没有绑定对应的消息
// 				return false;
// 			}

// 			for (let i = 0, fn; fn = fns[i++]; ) {
// 				fn(...values);
// 			}
// 		},
// 		remove: function(key, fn) {
// 			let fns = this.clientList[key];
// 			if (!fns) {
// 				return false;
// 			}
// 			if (!fn) { // 如果没有传入具体的回调函数，表示需要取消key对应消息的所有订阅
// 				fns && (fns.length = 0);
// 			} else {
// 				for (let i = fns.length - 1; i >= 0; i--) { // 反向遍历，因为要进行删除操作
// 					let _fn = fns[i];
// 					if (_fn === fn) {
// 						fns.splice(i, 1); // 删除订阅者的回调函数
// 					}
// 				}
// 			}
// 		}
// 	};

// 	let a = (() => {
// 		let count = 0;
// 		let button = document.getElementById('count');
// 		button.onclick = function() {
// 			event.trigger('add', count++);
// 		}
// 	})();

// 	let b = (() => {
// 		let div = document.getElementById('show');
// 		event.listen('add', (count) => {
// 			div.innerHTML = count;
// 		});
// 	})();
// })();

//=======================================8.11========================
// (() => {
// 	let Event = (() => {
// 		let global = this,
// 			Event,
// 			_default = 'default';

// 		Event = function() {
// 			let _listen,
// 				_trigger,
// 				_remove,
// 				_slice = Arrary.prototype.slice,
// 				_shift = Arrary.prototype.shift,
// 				_unshift = Arrary.prototype.unshift,
// 				namespaceCache = {},
// 				_create,
// 				find,
// 				each = (ary, fn) => {
// 					let ret;
// 					for (let i = 0; i < ary.length; i++) {
// 						let n = ary[i];
// 						ret =fn.call(n, i, n);
// 					}
// 					return ret;
// 				};

// 			_listen = (key, fn, cache) => {
// 				if (!cache[key]) {
// 					cache[key] = [];
// 				}
// 				cache[key].push(fn);
// 			};

// 			_remove = (key, cache, fn) => {
// 				if (cache[key]) {
// 					if (fn) {
// 						for (let i = 0; i < cache[key].length; i++) {
// 							if (cache[key][i] === fn) {
// 								cache[key].splice(i, 1);
// 							}
// 						}
// 					} else {
// 						cache[key] = [];
// 					}
// 				}
// 			};

// 			_trigger = () => {
// 				let cache = _shift(...arguments),
// 					key = _shift(...arguments),
// 					args = arguments,
// 					_self = this,
// 					ret,
// 					stack = cache[key];

// 				if (!stack || !stack.length) {
// 					return;
// 				}

// 				return each(stack, () => {
// 					return this.apply(_self, args);
// 				});
// 			};

// 			_create = (namespace) => {
// 				let namespace = namespace || _default;
// 				let cache = {}.
// 					offlineStack = [], //离线事件
// 					ret = {
// 						listen: (key, fn, last) => {
// 							_listen(key, fn, cache);
// 							if (offlineStack === null) {
// 								return;
// 							}
// 							if (last === 'last') {
// 								offlineStack.length && offlineStack.pop()();
// 							} else {
// 								each(offlineStack, () => {
// 									this();
// 								});
// 							}

// 							offlineStack = null;
// 						},

// 						one: (key, fn, last) => {
// 							_remove(key, cache);
// 							this.listen(key, cache, last);
// 						},

// 						remove: (key, fn) => {
// 							_remove(key, cache, fn);
// 						},

// 						trigger: () => {
// 							let fn,
// 								args,
// 								_self = this;

// 							_unshift.call(arguments, cache);
// 							args = arguments;
// 							fn = () => {
// 								return _trigger.apply(_self, args);
// 							};

// 							if (offlineStack) {
// 								return offlineStack.push(fn);
// 							}
// 							return fn();
// 						}
// 					};

// 					return namespace ?
// 						(namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret)
// 							: ret;
// 			};

// 			return {
// 				create: _create,
// 				one: function(key, fn, last) {
// 					let event = this.create();
// 					event.one(key, fn, last);
// 				},
// 				remove: function(key, fn) {
// 					let event = this.create();
// 					event.remove(key, fn);
// 				},
// 				listen: function(key, fn, last) {
// 					let event = this.create();
// 					event.listen(key, fn, last);
// 				},
// 				trigger: function() {
// 					let event = this.create();
// 					event.trigger.apply(this, arguments);
// 				}
// 			};
// 		};

// 		return Event;
// 	})();

// 	// 先发布后订阅
// 	Event.trigger('click', 1);
// 	Event.listen('click', (a) => {
// 		console.log(a);
// 	});

// 	// 使用命名空间
// 	Event.create('namespace1').listen('click', (a) => {
// 		console.log(a);
// 	});

// 	Event.create('namespace1').trigger('click', 1);

// 	Event.create('namespace2').listen('click', (a) => {
// 		console.log(a);
// 	});

// 	Event.create('namespace2').trigger('click', 2);
// })();
// 
// 
(() => {
    var Event = (function() {
        var global = this,
            Event,
            _default = 'default';
        Event = function() {
            var _listen,
                _trigger,
                _remove,
                _slice = Array.prototype.slice,
                _shift = Array.prototype.shift,
                _unshift = Array.prototype.unshift,
                namespaceCache = {},
                _create,
                find,
                each = function(ary, fn) {
                    var ret;
                    for (var i = 0, l = ary.length; i < l; i++) {
                        var n = ary[i];
                        ret = fn.call(n, i, n);
                    }
                    return ret;
                };
            _listen = function(key, fn, cache) {
                if (!cache[key]) {
                    cache[key] = [];
                }
                cache[key].push(fn);
            };
            _remove = function(key, cache, fn) {
                if (cache[key]) {
                    if (fn) {
                        for (var i = cache[key].length; i >= 0; i--) {
                            if (cache[key][i] === fn) {
                                cache[key].splice(i, 1);
                            }
                        }
                    } else {
                        cache[key] = [];
                    }
                }
            };
            _trigger = function() {
                var cache = _shift.call(arguments),
                    key = _shift.call(arguments),
                    args = arguments,
                    _self = this,
                    ret,
                    stack = cache[key];
                if (!stack || !stack.length) {
                    return;
                }
                return each(stack, function() {
                    return this.apply(_self, args);
                });
            };
            _create = function(namespace) {
                var namespace = namespace || _default;
                var cache = {},
                    offlineStack = [],
                    // 离线事件
                    ret = {
                        listen: function(key, fn, last) {
                            _listen(key, fn, cache);
                            if (offlineStack === null) {
                                return;
                            }
                            if (last === 'last') {
                                offlineStack.length && offlineStack.pop()();
                            } else {
                                each(offlineStack, function() {
                                    this();
                                });
                            }
                            offlineStack = null;
                        },
                        one: function(key, fn, last) {
                            _remove(key, cache);
                            this.listen(key, fn, last);
                        },
                        remove: function(key, fn) {
                            _remove(key, cache, fn);
                        },
                        trigger: function() {
                            var fn,
                                args,
                                _self = this;
                            _unshift.call(arguments, cache);
                            args = arguments;
                            fn = function() {
                                return _trigger.apply(_self, args);
                            };
                            if (offlineStack) {
                                return offlineStack.push(fn);
                            }
                            return fn();
                        }
                    };
                return namespace ?
                    (namespaceCache[namespace] ? namespaceCache[namespace] :
                        namespaceCache[namespace] = ret) : ret;

            };
            return {
                create: _create,
                one: function(key, fn, last) {
                    var event = this.create();
                    event.one(key, fn, last);
                },
                remove: function(key, fn) {
                    var event = this.create();
                    event.remove(key, fn);
                },
                listen: function(key, fn, last) {
                    var event = this.create();
                    event.listen(key, fn, last);
                },
                trigger: function() {
                    var event = this.create();
                    event.trigger.apply(this, arguments);
                }
            };
        }();
        return Event;
    })();

    /************** 先发布后订阅 ********************/

    Event.trigger('click', 1);
    Event.listen('click', function(a) {
        console.log(a);
        // 输出:1
    });

    /************** 使用命名空间 ********************/
    Event.create('namespace1').listen('click', function(a) {
        console.log(a);
        // 输出:1
    });
    Event.create('namespace1').trigger('click', 1);
    Event.create('namespace2').listen('click', function(a) {
        console.log(a);
        // 输出:2
    });
    Event.create('namespace2').trigger('click', 2);
})();
