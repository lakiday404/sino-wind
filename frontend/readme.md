# 客户端

- 移动端：

适配不同屏幕尺寸
不同屏幕尺寸页面元素的排版
不同屏幕尺寸元素的大小 （rem）
封装 rem.js 用来动态的修改页面跟字体大小
样式初始化

npm i react-router-dom 安装路由，开发登录注册页面

npm i less --save-dev

ajax 错误统一处理： npm install axios 安装 axios 替代 fetch

二次封装 axios

浏览器的储存

localStorage: 本地存储 （内存大小大约 5-8M， 永久有效）
sessionStorage: 会话存储 （内存大小大约 5-8M， 关闭页面就自动消失）
cookies：（内存大小大约 4K， 会自动携带在请求头， 后端控制它的有效时间）
IndexDB：客户端的数据库存储 （无穷大， 永久有效）
服务端
定义登录接口：

npm i koa-router 安装路由，用来分门别类的定义后端接口地址

路由层 : 定义接口 控制层 ：当前端请求该接口，响应的逻辑 模板层：响应逻辑中跟数据库打交道的代码

npm i koa-bodyparser 辅助 koa 解析 post 请求体中的参数

npm install --save mysql2 安装 mysql （用法看文档）

npm i bcrypt 通过bcrypt.js 对密码进行加密解密

token 令牌 -- 前端只有登录成功，后端会生成一个 token，并返回给前端，前端将 token 保存起来，并在未来的其他的接口请求时，将这个 token 携带上给后端，后端校验 token 合法后才返回正确的数据 npm i jsonwebtoken

定义验证码接口：

npm i svg-captcha
跨域
https: //42.245.43.1 :8080 /home 协议 域名 端口 路径

同源策略： 协议，域名，端口 都相同的两个端，才可以进行网络通信

解决跨域：

cors (设置响应头来告知浏览器允许哪些源访问我)

node 代理

去到前后端各自目录下，都跑 npm run dev

可能是我部署的时候删掉了一点东西，我换一个项目打开

reactplayground