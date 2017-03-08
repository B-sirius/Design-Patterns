'use strict';
//=========================10.4=========================
(() => {
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
    // 空调单独
    let openAcCommand = {
    	excute: function() {
    		console.log('打开空调');
    	}
    };
    // 电视与音箱连在一起，打包成一个宏命令
    let openTvCommand = {
    	excute: function() {
    		console.log('打开电视');
    	}
    };

    let openSoundCommand = {
    	excute: function() {
    		console.log('打开音箱');
    	}
    };

    let macroCommand1 = MacroCommand();
    macroCommand1.add(openTvCommand);
    macroCommand1.add(openSoundCommand);

    // 关门，打开电脑，登录Steam连在一起，打包
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

    let openSteamCommand = {
        excute: () => {
            console.log('登录Steam');
        }
    };

    let macroCommand2 = MacroCommand();
    macroCommand2.add(closeDoorCommand);
    macroCommand2.add(openPcCommand);
    macroCommand2.add(openSteamCommand);

    // 把所有的命令组合成一个炒鸡命令
    
    let superMacroCommand = MacroCommand();
    superMacroCommand.add(openAcCommand);
    superMacroCommand.add(macroCommand1);
    superMacroCommand.add(macroCommand2);

    // 给浮夸按钮绑定炒鸡命令
    let setCommand = ((command) => {
    	document.getElementById('button').onclick = function() {
    		command.excute();
    	}
    })(superMacroCommand);
})();

//========================10.9=====================================
(() => {
	
	let Folder = function(name) {
		this.name = name;
		this.parent = null;
		this.files = [];
	};

	Folder.prototype.add = function(file) {
		file.parent = this // 设置父对象
		this.files.push(file);
	}

	Folder.prototype.scan = function() {
		console.log('开始扫描文件夹：' + this.name);
		for (let i = 0; i < this.files.length; i++) {
			this.files[i].scan();
		}
	}

	Folder.prototype.remove = function() {
		if (!this.parent) { // 根节点或游离节点
			return;
		}
		for (let i = this.parent.files.length - 1; i >= 0; i--) { // 注意此时是遍历parent的文件，删除自然是在parent下进行
			let file = this.parent.files[i];
			if (file === this) {
				this.parent.files.splice(i, 1);
			}
		}
	}

	let File = function(name) {
		this.name = name;
		this.parent = null;
	};

	File.prototype.add = function(file) {
		throw new Error('不能添加在文件下面');
	};

	File.prototype.scan = function() {
		console.log('开始扫描文件：' + this.name);
	};

	File.prototype.remove = function() {
		if (!this.parent) { // 根节点或游离节点
			return;
		}
		for (let i = this.parent.files.length - 1; i >= 0; i--) { // 注意此时是遍历parent的文件，删除自然是在parent下进行
			let file = this.parent.files[i];
			if (file === this) {
				this.parent.files.splice(i, 1);
			}
		}
	};

	let gamesFolder = new Folder('游戏');
	gamesFolder.add(new File('拆迁六号'));
	gamesFolder.add(new File('ever17'));

	let studyFolder = new Folder('我爱学习');
	studyFolder.add(new File('js'));
	studyFolder.add(new File('css'));

	let documentFolder = new Folder('文档');
	documentFolder.add(gamesFolder);
	documentFolder.add(studyFolder);

	documentFolder.scan();

	studyFolder.remove();
	documentFolder.scan();

})();