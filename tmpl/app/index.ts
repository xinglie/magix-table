/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix';
Magix.applyStyle('@index.less');
export default Magix.View.extend({
    tmpl: '@index.html',
    render() {
        this.digest();
        let pres = Magix.node(this.id).getElementsByTagName('pre');
        for (let i = pres.length; i--;) {
            hljs.highlightBlock(pres[i]);
        }
    },
    'toggle<click>'(e) {
        let { index } = e.params;
        this.digest({
            ['show' + index]: !this.get('show' + index)
        });
    }
});