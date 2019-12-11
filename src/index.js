#!/usr/bin/env node

const cmd = require("commander");
const packageConfig = require('../package.json');
const exists = require('fs').existsSync;
const inquirer = require('inquirer');
const path=require('path');
const Metalsmith = require('metalsmith');
const Handlebars = require('handlebars');
const semver=require('semver');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const axios = require('axios');

cmd
    .usage('<command>')
    .version(packageConfig.version)
    .description('欢迎使用ss-cli');
cmd
    .command('create')
    .description('create projectName 创建项目')
    .action(() => {
        if(cmd.args[0]){
            create(cmd.args[0]);
        } else {
            inquirer.prompt([{
                type: 'input',
                message: '请输入项目名称:',
                name: 'name',
                default: 'ss-demo'
            }]).then(answers => {
                create(answers.name);
            }).catch(err=>{
                console.log(err);
            });
        }
    });
cmd
    .command('help')
    .description('查看帮助')
    .action(() => cmd.help());


cmd.parse(process.argv);
// if(!cmd.args.length){
//     cmd.help();
// }

function create(projectName) {
    const to = '.';
    const templatePath = path.join(__dirname, '../template');


    if (exists(path.resolve(process.cwd(),projectName))) {
        inquirer.prompt([{
            type: 'confirm',
            message: '目录已存在，是否继续？',
            name: 'ok'
        }]).then(answers => {
            if (answers.ok) {
                run();
            }
        }).catch(err=>{
            console.log(err);
        });
    } else {
        run();
    }

    function run() {
        checkVersion(()=> {
            generate(projectName, templatePath, to, err => {
                if (err) {
                    console.log(err)
                }
                console.log(logSymbols.success,chalk.green('生成'+projectName+'成功'));
            });
        });
    }

    function generate(projectName, templatePath, to, done) {
        console.log('generate')
        Metalsmith(process.cwd())
            .metadata({
                projectName: projectName
            })
            .clean(false)
            .source(templatePath)
            .destination(path.join(to,projectName))
            .use((files, metalsmith, done) => {
                Object.keys(files).forEach(fileName => { //遍历替换模板
                    if (excludeIgnoreFile(fileName)) {
                        // console.log(fileName);
                        const fileContentsString = files[fileName].contents.toString() //Handlebar compile 前需要转换为字符创
                        files[fileName].contents = new Buffer(Handlebars.compile(fileContentsString)(metalsmith.metadata()))
                    }
                })
                done()
            })
            .build(err => {
                done(err)
            })
    }

    function excludeIgnoreFile(fileName){
        const ignoreFileList = ['font','.DS_Store','.png','.jpg','.gif'];
        return ignoreFileList.every(function (ignoreFile) {
            return fileName.indexOf(ignoreFile)<0;
        })
    }

    async function checkVersion(done) {
        if (!semver.satisfies(process.version, packageConfig.engines.node)) {
            return console.log(logSymbols.error,chalk.red(
                ' 你的node版本必须 ' + packageConfig.engines.node + ' 才能使用ss-cli'
            ));
        }
        const res = await request({
            // 借用一个已发布npm的工具的版本号
            url: 'https://registry.npmjs.org/@datastory/ds-cli',
            method:'GET'
        });
        if(res.status===200) {
            // console.log(res.data['dist-tags']);
            const latestVersion = res.data['dist-tags'].latest;
            const localVersion = packageConfig.version;
            // 比较版本，如果本地版本比线上版本小，提示一下
            if (semver.lt(localVersion, latestVersion)) {
                console.log(logSymbols.info,chalk.yellow('报告!有一个新的ss-cli版本'));
                console.log(logSymbols.success,'现在最新的是:' + chalk.green(latestVersion));
                console.log(logSymbols.warning,'你下载的是:' + chalk.red(localVersion));
                console.log(logSymbols.warning,'请更新至最新版本后继续使用。' );
            } else {
                console.log(logSymbols.success,chalk.green('当前为ss-cli最新版本,可放心使用。'));
                done();
            }
        } else {
            console.log(logSymbols.error,`查询线上版本失败${res.data}`);
        }
    }

    function request(options) {
        return new Promise((resolve, reject) => {
            axios(options).then(res => {
                resolve(res)
            }).catch(err => {
                reject({type:'ajax请求',msg:err})
            })
        })
    }
}