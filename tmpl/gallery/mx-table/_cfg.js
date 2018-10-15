//#gcfg;
let PreAttrs = {
    'fixed-left': 'fl',
    'fixed-right': 'fr'
};
let ProcessAttr = (attrs, className) => {
    let attrStr = '',
        classAdded = false;
    if (attrs['fixed-top']) {
        className += ' mx-tb-ft';
    } else if (attrs['fixed-bottom']) {
        className += ' mx-tb-fb';
    }
    for (let p in attrs) {
        if (p != 'fixed-top' && p != 'fixed-bottom') {
            let v = attrs[p];
            if (p == 'class') {
                attrStr += ` class="${className} ${v}"`;
                classAdded = true;
            } else {
                if (v === true) v = '';
                else v = '="' + v + '"';
                p = PreAttrs[p] || p;
                attrStr += ' ' + p + v;
            }
        }
    }
    if (!classAdded) {
        attrStr += ' class="' + className + '"';
    }
    return attrStr;
};
module.exports = {
    'mx-table'(i) {
        return `<div mx-view="${i.mxView}" ${i.attrs}>${i.content}</div>`;
    },
    'mx-table.cell'(i) {
        let attrs = i.attrsKV;
        let c = i.content;
        if (attrs.topspan) {
            c = `<div style="transform:translateY(-${attrs.topspan}00%)">${c}</div>`;
        }
        if (attrs.group) {
            c = `<div class="mx-tb-group">${c}</div>`;
        }
        return `<div${ProcessAttr(attrs, 'mx-tb-cell')}>${c}</div>`;
    },
    'mx-table.row'(i) {
        return `<div${ProcessAttr(i.attrsKV, 'mx-tb-row')}>${i.content}</div>`;
    },
    'mx-table.body'(i) {
        return `<div${ProcessAttr(i.attrsKV, 'mx-tb-body')}>${i.content}</div>`;
    },
    'mx-table.head'(i) {
        return `<div${ProcessAttr(i.attrsKV, 'mx-tb-head')}>${i.content}</div>`;
    },
    'mx-table.foot'(i) {
        return `<div${ProcessAttr(i.attrsKV, 'mx-tb-foot')}>${i.content}</div>`;
    },
    'mx-table.scrollbar'(i) {
        return `<div${ProcessAttr(i.attrsKV, 'mx-tb-bar mx-tb-scroller')}><div class="mx-tb-bar-ph"></div></div>`;
    }
};