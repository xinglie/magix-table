# magix-table
> 使用`div`模拟`table`

**本项目仅供参考，需要浏览器`css`支持`display:flex`,`position:sticky`等特性**

### 为什么模拟`table`
> 从功能上来讲，行列的数据更适合使用`table`，所以当您的需求中没有固定表头，固定列时，请直接使用`table`，模拟`table`更多的是解决固定表头，固定列等事情。

### `table`有哪些问题
#### body不能滚动
当数据量多时，我们期望表头或表尾固定，只滚动中间区域，但是`<tbody>`不能做为滚动容器。如果我们强制改变`<tbody>`的`display`使它可以滚动，然后`<thead>`中的列和`<tbody>`中的列就对不齐了。

然后我们可能就要上`javascript`然后各种同步列的宽度了，然后你会发现解决`1`个问题会引入`3`个问题，到最后列可能还会有些许的偏差并没有对齐。

这个网上的案例有一些，感兴趣的话可以搜搜看
#### sticky
我们知道`css3`中`position`新增了`sticky`，如果浏览器支持，直接在`<thead>`上使用`position:sticky`就完成了表头固定，多好？

`chrome`曾经支持过`<thead>`上设置`position:sticky`，但是后来不知为何又去掉了，然后目前没有浏览器支持`<thead>`上设置`position:sticky`，这都什么鬼？具体可以看下`caniuse`。https://caniuse.com/#search=sticky

### `table`做固定表头，固定列功能
网上常见的做法是使用`4`个表格来完成相应的功能，以`ant.design`为代表，可以看下它的效果和实现:https://ant.design/components/table-cn/ 

这种做法实现起来麻烦，计算的量也不少，在表头固定、首列固定、尾列固定、表尾固定这些需求同时存在的情况下，列对齐需要计算，然后同步。行高需要计算，然后同步，据说`ant.design`是以中间行为最大高度，然后去同步首列中的行和尾列的行。

做到最后依然可能对不齐，我在`ant.design`中的表格组件上经常能见到对不齐的`bug`

做完各种计算后，如果要实现鼠标移上行变色，你会发现`css`中的`hover`伪类没法使用，因为表格是分离的，这时候就又需要绑定`javascript`事件进行模拟实现，这个简直了...

### `div`模拟表格
该方法仍然需要计算，但计算量少了很多，只需要列宽计算

因为行没有被拆分，所以行高不需要计算对齐，同时可以使用`css`中的`hover`伪类实现鼠标移入变色

示例可查看　https://xinglie.github.io/magix-table/index.html
