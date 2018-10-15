import Magix from 'magix';
Magix.applyStyle('@index.less');
let PReg = /^(\d+)(%|px)?$/;
let ParseWidth = (percent: string) => {
    let m = percent.match(PReg) as [string, number, string];
    if (m) {
        let w = m[1] | 0;
        if (m[2] != '%' && w < 1) {
            w = 1;
        }
        if (m[2] == '%') {
            w /= 100;
        }
        return w;
    }
    return 0;
};
let GetWidth = (containerWidth, colWidths, begin, end, spec?: boolean) => {
    let w = 0, hasSpecNum = 0;
    for (let i = begin, v; i < end; i++) {
        v = colWidths[i];
        if (hasSpecNum) {
            if (v < 1) {
                w += v * containerWidth;
            } else {
                w += v;
            }
        } else if (v >= 1) {
            w *= containerWidth;
            hasSpecNum = 1;
            w += v;
        } else {
            w += v;
        }
    }
    if (spec && !hasSpecNum) {
        hasSpecNum = 1;
        w *= containerWidth;
    }
    return hasSpecNum ? w + 'px' : w * 100 + '%';
};
let UpdateCell = (containerWidth, colWidths, cells, lefts, rights) => {
    let start = 0,
        addRight = false,
        lastLeft = null;
    for (let cell of cells) {
        if (cell.nodeType == 1) {
            let colspan = (cell.getAttribute('colspan') || 1) | 0;
            let w = GetWidth(containerWidth, colWidths, start, start + colspan);
            cell.style.width = w;
            if (cell.hasAttribute('fl')) {
                lastLeft = cell;
                w = GetWidth(containerWidth, colWidths, 0, start, true);
                cell.classList.add('@index.less:fixed');
                cell.style.left = w;
            } else if (cell.hasAttribute('fr')) {
                w = GetWidth(containerWidth, colWidths, start + colspan, colWidths.length, true);
                if (!addRight) {
                    rights.push(cell);
                    addRight = true;
                }
                cell.classList.add('@index.less:fixed');
                cell.style.right = w;
            }
            start += colspan;
        }
    }
    if (lastLeft) {
        lefts.push(lastLeft);
    }
};
export default Magix.View.extend({
    assign() {
        this['@{set.left}'] = 0;
        this['@{set.right}'] = 0;
        this['@{stop.timer}']();
        this['@{teardown.scroll.listen}']();
        return true;
    },
    '@{stop.timer}'() {
        clearTimeout(this['@{scroll.timer}']);
    },
    '@{start.timer}'() {
        this['@{scroll.timer}'] = setTimeout(this.wrapAsync(() => {
            this['@{scroll.type}'] = 0;
        }), 50);
    },
    '@{setup.scroll.listen}'(head, body, bar) {
        let me = this, left = 0;
        head.onscroll = () => {
            if (!me['@{scroll.type}'] ||
                me['@{scroll.type}'] == 'h') {
                me['@{stop.timer}']();
                me['@{scroll.type}'] = 'h';
                left = head.scrollLeft;
                body.scrollLeft = left;
                if (bar) {
                    bar.scrollLeft = left;
                }
                me['@{sync.state}']();
                me['@{start.timer}']();
            }
        };
        body.onscroll = () => {
            if (!me['@{scroll.type}'] ||
                me['@{scroll.type}'] == 'b') {
                me['@{stop.timer}']();
                me['@{scroll.type}'] = 'b';
                left = body.scrollLeft;
                head.scrollLeft = left;
                if (bar) {
                    bar.scrollLeft = left;
                }
                me['@{sync.state}']();
                me['@{start.timer}']();
            }
        };
        if (bar) {
            bar.onscroll = () => {
                if (!me['@{scroll.type}'] ||
                    me['@{scroll.type}'] == 'a') {
                    me['@{stop.timer}']();
                    me['@{scroll.type}'] = 'a';
                    left = bar.scrollLeft;
                    head.scrollLeft = left;
                    body.scrollLeft = left;
                    me['@{sync.state}']();
                    me['@{start.timer}']();
                }
            };
            me['@{scroll.bar}'] = bar;
        }
        me['@{scroll.head}'] = head;
        me['@{scroll.body}'] = body;
    },
    '@{teardown.scroll.listen}'() {
        let me = this;
        let { '@{scroll.head}': head, '@{scroll.body}': body, '@{scroll.bar}': bar } = me;
        if (head) {
            head.onscroll = null;
        }
        if (body) {
            body.onscroll = null;
        }
        if (bar) {
            bar.onscroll = null;
        }
    },
    '@{sync.state}'() {
        let head = this['@{scroll.head}'];
        let setLeft = this['@{set.left}'];
        let setRight = this['@{set.right}'];
        let lefts = this['@{left.cells}'];
        let rights = this['@{right.cells}'];
        if (head.scrollLeft < 5) {
            if (setLeft) {
                this['@{set.left}'] = 0;
                for (let c of lefts) {
                    c.classList.remove('@index.less:fixed-left');
                }
            }
        } else {
            if (!setLeft) {
                this['@{set.left}'] = 1;
                for (let c of lefts) {
                    c.classList.add('@index.less:fixed-left');
                }
            }
        }
        if (head.scrollLeft + head.clientWidth > head.scrollWidth - 5) {
            if (setRight) {
                this['@{set.right}'] = 0;
                for (let c of rights) {
                    c.classList.remove('@index.less:fixed-right');
                }
            }
        } else {
            if (!setRight) {
                this['@{set.right}'] = 1;
                for (let c of rights) {
                    c.classList.add('@index.less:fixed-right');
                }
            }
        }
    },
    '@{set.width}'(containerWidth, head, body, bar) {
        let count = -1,
            colWidths = [],
            allCells = [],
            rows = head.childNodes;
        for (let row of rows) {
            if (row.nodeType == 1) {
                let cells = row.childNodes;
                let rCells = 0, index = 0,
                    rows = {
                        row,
                        cells: []
                    };
                for (let cell of cells) {
                    if (cell.nodeType == 1) {
                        let colspan = (cell.getAttribute('colspan') || 1) | 0;
                        let width = cell.getAttribute('width');
                        if (width && colspan == 1) {
                            colWidths[index] = ParseWidth(width);
                        }
                        rCells += colspan;
                        index++;
                        rows.cells.push(cell);
                    }
                }
                allCells.push(rows);
                if (rCells > count) count = rCells;
            }
        }
        let percent = 0, spec = 0, empty = 0;
        for (let i = count, v; i--;) {
            v = colWidths[i];
            if (v === undefined) {
                empty++;
            } else if (v < 1) {
                percent += v;
            } else {
                spec += v;
            }
        }
        //混用情况
        if (spec > 0 && percent > 0) {
            let pw = containerWidth - spec;
            let dw = pw * (1 - percent) / empty;
            for (let i = count, v; i--;) {
                v = colWidths[i];
                if (v === undefined) {
                    colWidths[i] = dw;
                    spec += dw;
                } else if (v < 1) {
                    colWidths[i] *= pw;
                    spec += colWidths[i];
                }
            }
            if (DEBUG) {
                let tw = 0;
                for (let cw of colWidths) {
                    tw += cw;
                }
                if (Math.abs(tw - containerWidth) > 1) {
                    console.error('Set wrong column width for table id :' + this.id);
                }
            }
        } else if (percent == 0) {//固定值，要检查是否小于容器
            if (spec < containerWidth) {
                let dw = (containerWidth - spec) / empty;
                for (let i = count, v; i--;) {
                    v = colWidths[i];
                    if (v !== undefined) {
                        colWidths[i] = v / spec;
                    } else {
                        colWidths[i] = dw;
                    }
                }
                spec = 0;
            }
        }
        let lefts = [], rights = [];
        let forceWidth = spec ? spec + 'px' : 'auto';
        for (let { row, cells } of allCells) {
            row.style.width = forceWidth;
            UpdateCell(containerWidth, colWidths, cells, lefts, rights);
        }
        if (bar) {
            let fill = bar.firstElementChild;
            fill.style.width = forceWidth;
        }
        let bRows = body.childNodes;
        for (let row of bRows) {
            if (row.nodeType == 1) {
                row.style.width = forceWidth;
                let cells = row.childNodes;
                UpdateCell(containerWidth, colWidths, cells, lefts, rights);
            }
        }
        this['@{left.cells}'] = lefts;
        this['@{right.cells}'] = rights;
    },
    render() {
        let me = this;
        let node = Magix.node(me.id);
        if (navigator.userAgent.indexOf('Firefox') > -1) {
            node.classList.add('@scoped.style:mx-tb-bs-ff');
        }
        let nowWidth = node.clientWidth;
        let nodes = node.childNodes;
        let head, body, foot, bar;
        for (let node of nodes) {
            let cn = node.className;
            if (cn.indexOf('@scoped.style:mx-tb-head') > -1) {
                head = node;
            } else if (cn.indexOf('@scoped.style:mx-tb-body') > -1) {
                body = node;
            } else if (cn.indexOf('@scoped.style:mx-tb-foot') > -1) {
                foot = node;
            }
        }
        if (foot) {
            bar = foot.getElementsByClassName('@scoped.style:mx-tb-bar')[0];
        }
        this['@{setup.scroll.listen}'](head, body, bar);
        this['@{set.width}'](nowWidth, head, body, bar);
        this['@{sync.state}']();
    },
    '$win<resize>'() {
        this.render();
    }
});