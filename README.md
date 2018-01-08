# textarea
autoHeightTextarea自适应高度的textarea是一款jquery插件，支持链式调用，支持设置最小行数、最小高度、最大行数和最大高度，在输入文字的时候实现textarea的高度自适应。

## 参数说明 ##
| 参数| 描述| 
| ------- |:-----| 
|rows|可以在textarea上设置 rows 又或者传参 rows 都可以设置textarea的一个最小行数|
|minRows|可以在初始化的时候传参 minRows 或者在textarea上面设置 data-min-rows ,来确定textarea的一个最小行数|
|maxRows|可以在初始化的时候传参 maxRows 或者在textarea上面设置 data-max-rows ,来确定textarea的一个最大行数|
|min-height|可以在css中设置 min-height ,来确定textarea的最小高度|
|max-height|可以在css中设置 max-height ,来确定textarea的最大高度|

## 使用 ##
使用的时候就像平常使用jquery一样：
```
$("#textarea1").autoHeightTextarea();
```
## 最终效果 ##

```
1、minRows = Math.max($("textarea").attr("rows"), $("textarea").attr("data-min-rows"), rows, minRows);
2、maxRows = Math.min($("textarea").attr("data-max-rows");
3、如果设置的rows或者代表minRows大于代表maxRows的时候，则以 maxRows 的值设置 minRows 和 maxRows。
```

如果要看更具体的文档说明，可点击此处查看：[http://www.fxss5201.cn/project/html/textarea/autoHeightTextarea/](http://www.fxss5201.cn/project/html/textarea/autoHeightTextarea/)
