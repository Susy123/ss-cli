/***
 * 检查一下node版本
 * 获取一下cli版本
 */

// 版本号处理
const semver=require('semver');
// 动态执行
const packageConfig = require('../package.json');

// console.log(packageConfig);
const chalk = require('chalk');

const logSymbols = require('log-symbols');

export default async (done)=> {
    if (!semver.satisfies(process.version, packageConfig.engines.node)) {
        return console.log(logSymbols.error,chalk.red(
            ' 你的node版本必须 >=' + packageConfig.engines.node + '.x 才能使用ss-cli'
        ));
    }
    const res=await tool.request({
            url: '/ss-cli',
            method: 'GET'
        }
    );
    if(res.status===200) {
        const latestVersion = res.data['dist-tags'].latest;
        const localVersion = packageConfig.version;
        // 比较版本，如果本地版本比线上版本小，提示一下
        if (semver.lt(localVersion, latestVersion)) {
            console.log(logSymbols.info,chalk.yellow('报告!有一个新的ss-cli版本'));
            console.log(logSymbols.success,'现在最新的是:' + chalk.green(latestVersion));
            console.log(logSymbols.warning,'你下载的是:' + chalk.red(localVersion));
        }
    } else {
        console.log(logSymbols.error,`获取线上仓库失败${res.data}`);
    }

    // 执行回调
    done();
};