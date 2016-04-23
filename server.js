'use strict'

const koa = require('koa')
const koaRouter = require('koa-router')
const send = require('koa-send')

const app = koa();
const staticRouter = koaRouter();

staticRouter.get('/', function*() {
  yield send(this, 'website/index.html')
})
staticRouter.get('/:path*', function*(next) {
  if (!this.params.path.startsWith('api/')) {
    yield send(this, this.params.path, { root: __dirname + '/website' })
  }
  yield next;
})

let apiRouter = koaRouter();

apiRouter.get('/test', function*(next) {
  this.body = 'hi'

  yield next
})

staticRouter.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

app.use(staticRouter.routes(), staticRouter.allowedMethods());
const port = 3000;
const ip = '0.0.0.0';
module.exports = app.listen(port, ip);
console.log(`Server listening on ${ip}:${port}`);
