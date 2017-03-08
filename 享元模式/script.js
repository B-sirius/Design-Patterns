'use strict';
//==============================12.4.1=======================================
// (() => {
// let id = 0;

// window.startUpload = function(uploadType, files) { // 这是一个全局函数
//     for (let i = 0, file; file = files[i++];) {
//         let uploadObj = new Upload(uploadType, file.fileName, file.fileSize);
//         uploadObj.init(id++); // 给upload对象设置唯一的id
//     }
// };

//     let Upload = function(uploadType, fileName, fileSize) {
//         this.uploadType = uploadType;
//         this.fileName = fileName;
//         this.fileSize = fileSize;
//         this.dom = null;
//     };

//     Upload.prototype = {
//         init: function(id) {
//             let self = this;
//             this.id = id;
//             this.dom = document.createElement('div');
//             this.dom.innerHTML =
//                 `<span>文件名称：${this.fileName}，文件大小：${this.fileSize}</span>
// 				<button class="delFile">删除</button>`;

//             this.dom.querySelector('.delFile').onclick = function() {
//                 self.delFile();
//             }
//             document.body.appendChild(this.dom);
//         },

//         delFile: function() {
//             if (this.fileSize < 3000) {
//                 return this.dom.parentNode.removeChild(this.dom);
//             }
//             if (window.confirm(`确定要删除该文件吗？${this.fileName}`)) {
//                 return this.dom.parentNode.removeChild(this.dom);
//             }
//         }
//     }

// startUpload('plugin', [{
//     fileName: '1.txt',
//     fileSize: 1000
// }, {
//     fileName: '2.html',
//     fileSize: 3000
// }, {
//     fileName: '3.txt',
//     fileSize: 5000
// }]);

// startUpload('flash', [{
//     fileName: '4.txt',
//     fileSize: 1000
// }, {
//     fileName: '5.html',
//     fileSize: 3000
// }, {
//     fileName: '6.txt',
//     fileSize: 5000
// }]);
// })();

//==================================12.4.4===================================
(() => {
    let id = 0;

    let Upload = function(uploadType) {
        this.uploadType = uploadType;
    };

    Upload.prototype.delFile = function(id) {
        uploadManager.setExternalState(id, this); // 从外部读取文件的额外属性

        if (this.fileSize < 3000) {
            return this.dom.parentNode.removeChild(this.dom);
        }

        if (window.confirm(`确定要删除该文件吗？${this.fileName}`)) {
            return this.dom.parentNode.removeChild(this.dom);
        }
    };

    let UplaodFactory = (function() {
        let createdFlyWeightObjs = {};

        return {
            create: function(uploadType) {
                if (createdFlyWeightObjs[uploadType]) { // 如果有则返回现有
                    return createdFlyWeightObjs[uploadType];
                }

                return createdFlyWeightObjs[uploadType] = new Upload(uploadType);
            }
        }
    })();

    let uploadManager = (function() {
        let uploadDatabase = {};

        return {
            add: function(id, uploadType, fileName, fileSize) {
                let flyWeightObj = UplaodFactory.create(uploadType);

                let dom = document.createElement('div');
                dom.innerHTML =
                    `<span>文件名称：${fileName}，文件大小：${fileSize}</span>
					<button class="delFile">删除</button>`;
                dom.querySelector('.delFile').onclick = function() {
                    flyWeightObj.delFile(id);
                }
                document.body.appendChild(dom);

                uploadDatabase[id] = {
                    fileName: fileName,
                    fileSize: fileSize,
                    dom: dom
                };

                return flyWeightObj;
            },

            setExternalState: function(id, flyWeightObj) {
                let uploadData = uploadDatabase[id];
                for (let i in uploadData) {
                    flyWeightObj[i] = uploadData[i];
                }
            }
        }
    })();

    window.startUpload = function(uploadType, files) { // 这是一个全局函数
        for (let i = 0, file; file = files[i++];) {
            let uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
        }
    };

    startUpload('plugin', [{
        fileName: '1.txt',
        fileSize: 1000
    }, {
        fileName: '2.html',
        fileSize: 3000
    }, {
        fileName: '3.txt',
        fileSize: 5000
    }]);

    startUpload('flash', [{
        fileName: '4.txt',
        fileSize: 1000
    }, {
        fileName: '5.html',
        fileSize: 3000
    }, {
        fileName: '6.txt',
        fileSize: 5000
    }]);
})();
