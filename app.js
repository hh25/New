
// 模块导入
const fs=require('fs');
const http=require('http');
const path=require('path');

// 导入第三方模块
const mime=require('mime');

// 记录网站根目录
let Path=path.join(__dirname,'www');
// 创建服务器
let server=http.createServer((request,response)=>{
    // 生成地址(用户输入的地址)
    let targetPath=path.join(Path,request.url);
    //判断地址是否存在
    if(fs.existsSync(targetPath)){
        // 存在?是文件夹还是文件
        fs.stat(targetPath,(err,stats)=>{
            //如果是文件
            if(stats.isFile()){
                response.setHeader("content-type",mime.getType(targetPath));
                //读取文件
                fs.readFile(targetPath,(err,data)=>{
                    response.end(data);
                })
            }
            //文件夹
            if(stats.isDirectory()){
                //读取文件夹信息
                fs.readdir(targetPath,(err,files)=>{
                    let tem='';
                    console.log(targetPath+"====="+request.url)
                    //遍历文件夹
                    for(let i=0;i<files.length;i++){
                        tem+=`
                        <li>
                           <a href="${request.url}${request.url=='/'?'':'/'}${files[i]}">${files[i]}</a>
                        </li> 
                        `
                    }

                    // 读取完之后再返回
                    response.end(`
                    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
                    <html>
                    
                    <head>
                        <title>Index of/ </title>
                    </head>
                    
                    <body>
                        <h1>Index of ${request.url}</h1>
                        <ul>
                            ${tem}
                        </ul>
                    </body>
                    
                    </html>
                    `)

                })
            }
        })
    }else{
        //由于这里只能设置头不能设置状态码,所以需要到nodejs文档中查询设置状态码的方法
        response.statusCode = 404;
        response.setHeader("content-type", "text/html;charset=utf-8");
        response.end(`
        <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
        <html><head>
        <title>404 Not Found</title>
        </head><body>
        <h1>Not Found</h1>
        <p>你请求的${request.url} 不在服务器上哦,检查一下呗</p>
        </body></html>
        `)
    }
})

server.listen(8846,'127.0.0.1',() => {
    console.log('监听成功')
})