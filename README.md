模仿 vue-cli 的一个简单的模板生产工具

clone后：

npm install

node ./src/index.js create prjectName 进行运行调试。

也可以：

npm install -g // 安装本项目到全局

就可以在任一目录下执行：

ss-cli help

ss-cli create projectName


这是靠package.json
"bin": {
    "ss-cli": "src/index.js"
  },
  做到的.
  
  最后可以 npm publish 发布到 npm 源上，然后 npm install @ss/ss-cli -g 的方式进行全局安装后使用。