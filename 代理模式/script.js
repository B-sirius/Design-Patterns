'use strict';
//=========================6.1============================
(() => {
    let Watch = function() {
        this.id = '迪士尼童表';
    }

    let xiaoming = {
        sendWatch: function(target) {
            let watch = new Watch();
            target.receiveWatch(watch);
        }
    }

    let B = {
        receiveWatch: function(watch) {
            console.log('b接收了' + watch.id);
            A.listenGoodMood(() => {
                A.receiveWatch(watch);
            })
        }
    }

    let A = {
        listenGoodMood: function(fn) {
            setTimeout(() => {
                fn();
            }, 5000);
        },
        receiveWatch: function(watch) {
            console.log('a接收了' + watch.id);
        }
    }
    xiaoming.sendWatch(B);
})();

//============================6.3==========================
(() => {
	let myImage = (() => {
		let imgNode = document.createElement('img');
		document.body.appendChild(imgNode);

		return {
			setSrc: function(src) {
				imgNode.src = src;
			}
		};
	})();

	let proxyImage = (() => {
		console.log('first?');
		let img = new Image;
		// 这里的img仅仅是用于发起请求，在img加载完成后，改变myImage的src，此时图片已经缓存，便可直接显示
		img.onload = function() {
			myImage.setSrc(this.src);
		}
		return {
			setSrc: function(src) {
				console.log('second');
				myImage.setSrc('./img/loading.gif');
				img.src = src;
			}
		}
	})();

	proxyImage.setSrc('https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2083471620,1999314710&fm=11&gp=0.jpg');
})();

//============================6.6==================================
(() => {
	let synchronousFile = (id) => {
		console.log('开始同步文件' + id);
	};
	let proxySynchronousFile = (() => {
		let cache = [], timer;
		return (id) => {
			cache.push(id);
			if (timer) { // 保证不会覆盖已经启动的计时器
				return;
			}

			timer = setTimeout(() => {
				synchronousFile(cache.join(','));
				clearTimeout(timer);
				timer = null;
				cache.length = 0; // 清空id集合
			}, 2000);
		}
	})();

	let checkbox = document.getElementsByTagName('input');
	for (let i = 0, c; c = checkbox[i++]; ) {
		c.onclick = function() {
			if (this.checked === true) {
				proxySynchronousFile(this.id);
			}
		};
	}
})();