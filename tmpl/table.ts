//#loader=none;
if (typeof DEBUG == 'undefined') DEBUG = true;
'@./lib/sea.js';
'@./lib/magix.js';
setTimeout(() => {
    let node = document.getElementById('boot') as HTMLScriptElement;
    let src = node.src.replace('/table.js', '');
    let Env = {
        cdn: src
    };
    seajs.config({
        paths: {
            app: Env.cdn + '/app',
            gallery: Env.cdn + '/gallery'
        }
    });
    seajs.use('magix', (Magix: Magix) => {
        Magix.applyStyle('@scoped.style');
        Magix.boot({
            defaultPath: '/index',
            defaultView: 'app/index',
            rootId: 'app',
            error(e: Error) {
                setTimeout(() => {
                    throw e;
                }, 0);
            }
        });
    });
}, 0);