const Metalsmith = require('metalsmith');
const Handlebars = require('handlebars');
const chalk = require('chalk');

export default async function generate(name:string,templatePath:string,to:string,done) {
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