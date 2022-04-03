//创建文件、文件夹
import fs from 'fs'
import cheerio from 'cheerio' //cheerio爬虫
import pkg from 'sync-request';//node的网络请求
import request from 'request' //利用request模块保存图片


const requests = pkg
var html = '';

let count = 0 // 记录扒取的图片数量

let imgDirName = '' // 图片存放的目录

let url = "https://www.colorhub.me/search?color=483b64"; // 目标网站

// 拿到网站内容转化成html字符串

html = requests('GET', url).getBody().toString();


// 调用自己的方法

filterSlideList(html)

function filterSlideList (html) {

    if (html) {

        var $ = cheerio.load(html); // 利用cheerio模块将完整的html装载到变量$中，之后就可以像jQuery一样操作html了

        // 拿到图片的父容器

        var $imgdom = $(".masonry");

        // 拿到主题,并使用主题名字(名字太长，截取一下)创建文件夹

        var imgarrname = $("#color-input").val();

        console.log("开始爬 " + $("#color-input").val() + " 主题的图片")

        //创建放图片的文件夹

        fs.mkdir('./img/' + imgarrname + '/', (err) => {
            if (err) {
                console.log(err)
            }
        })

        //取每一张图片，并把图片放到目录下

        $imgdom.find('.grid-item').each(function (index, el) {
            var imgurl = $(this).children('.photo-card').find('img').attr("src") //拿到图片的在线链接
            var imgnam = $(this).children('.photo-card').find('img').attr("alt") //拿到图片的标题
            // 利用request模块保存图片
            request('https:' + imgurl).pipe(fs.createWriteStream('./img/' + imgarrname + '/' + imgnam + '.jpg'))
            count++;
            // console.log(imgurl);
            console.log(imgnam);
            console.log('已爬取图片' + count + '张');
        });

    }

}
