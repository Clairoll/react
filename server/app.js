(async function() {

    const Koa = require('koa');
    const KoaBodyParser = require('koa-bodyparser');
    const router = require('./router/main');
    const view = require('./router/view');
    const path = require('path')
    const serve = require('koa-static')


    const app = new Koa();

    app.use(serve(__dirname , '/public'))

    app.use( KoaBodyParser() );

    app.use( router.routes() );

    app.use( view.routes() );
    app.listen(8888);

})();