/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix5';
Magix.applyStyle('@index.less');
export default Magix.View.extend({
    tmpl: '@index.html',
    render() {
        this.digest({
            count:4
        });
        let pres = this.root.getElementsByTagName('pre');
        for (let i = pres.length; i--;) {
            hljs.highlightBlock(pres[i]);
        }
    },
    'toggle<click>'(e) {
        let { index } = e.params;
        this.digest({
            ['show' + index]: !this.get('show' + index)
        });
    },
    'refresh<click>'() {
        this.digest({
            count: Math.random() * 10 | 0
        })
    }
});