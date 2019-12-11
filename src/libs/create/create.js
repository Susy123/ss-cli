const cmd = require('commander');
const exists = require('fs').existsSync;
const inquirer = require('inquirer');
const path=require('path');
const Metalsmith = require('metalsmith');

export default function(projectName) {
    const to = '.';
    const templatePath = path.join(__dirname, 'template');

    if (exists(path.resolve(process.cmd(),projectName))) {
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
                if (err) logger.fatal(err);
                logger.success(`生成${name}文件夹`);
            });
        });
    }

    function generate(projectName, templatePath, to, done) {
        Metalsmith(process.cwd())
            .metadata({
                projectName: name
            })
            .clean(false)
            .source(templatePath)
            .destination(to) //最终编译好的文件存放位置
            .build(err => {
                done(err)
            })
    }
}
