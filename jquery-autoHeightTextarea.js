/** 
 * 自适应textarea的高度变化
 * 可以在textarea上设置rows/data-min-rows/data-max-rows
 * 也可以直接传参rows/minRows/MaxRows
 * 最终呈现效果：minRows = Math.max($("textarea").attr("rows"), $("textarea").attr("data-min-rows"), rows, minRows);
 *              maxRows = Math.min($("textarea").attr("data-max-rows"), maxRows);
 *              如果设置的rows或者代表minRows大于代表maxRows的时候，则以 maxRows 的值设置 minRows 和 maxRows
 * time：2018-01-06
 * by 樊小书生: http: //www.fxss5201.cn/project/html/textarea/autoHeightTextarea/
 * github: https://github.com/fxss5201/textarea
 */
;
(function($) {
    $.fn.autoHeightTextareaDefaults = {
        rows: 0,
        minRows: 0,
        maxRows: null,
        HIDDEN_STYLE: `
            height:0 !important;
            visibility:hidden !important;
            overflow:hidden !important;
            position:absolute !important;
            z-index:-1000 !important;
            top:0 !important;
            right:0 !important;
        `,
        CONTEXT_STYLE: [
            'letter-spacing',
            'line-height',
            'padding-top',
            'padding-bottom',
            'font-family',
            'font-weight',
            'font-size',
            'text-rendering',
            'text-transform',
            'width',
            'text-indent',
            'padding-left',
            'padding-right',
            'border-width',
            'box-sizing'
        ],
        calculateNodeStyling: function(targetElement) {
            var _this = this;
            // 获取设置在当前textarea上的css属性
            var style = window.getComputedStyle(targetElement);
            var boxSizing = style.getPropertyValue('box-sizing');
            var paddingSize = (
                parseFloat(style.getPropertyValue('padding-bottom')) +
                parseFloat(style.getPropertyValue('padding-top'))
            );
            var borderSize = (
                parseFloat(style.getPropertyValue('border-bottom-width')) +
                parseFloat(style.getPropertyValue('border-top-width'))
            );
            var contextStyle = _this.CONTEXT_STYLE.map(function(value) {
                return value + ':' + style.getPropertyValue(value)
            }).join(';');

            return { contextStyle, paddingSize, borderSize, boxSizing };
        },
        mainAlgorithm: function(hiddenTextarea, textareaElement) {
            var _this = this;
            /**
             * 主要的算法依据
             * @param {string} textareaElement : textarea的DOM对象
             */
            var {
                paddingSize,
                borderSize,
                boxSizing,
                contextStyle
            } = _this.calculateNodeStyling(textareaElement);

            // 将获取到得当前得textarea的css属性作用于隐藏的textarea
            hiddenTextarea.setAttribute('style', _this.HIDDEN_STYLE + contextStyle);
            // 将当前的textarea的value设置到隐藏的textarea上面
            hiddenTextarea.value = textareaElement.value || textareaElement.placeholder || '';

            // 获取隐藏的textarea的height
            var height = hiddenTextarea.scrollHeight;
            if (boxSizing === 'border-box') {
                height = height + borderSize;
            } else if (boxSizing === 'content-box') {
                height = height - paddingSize;
            }
            hiddenTextarea.value = '';
            var singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

            // 如果设置有最小行数和最大行数时的判断条件，如果没有设置则取rows为最小行数
            var minRows;
            var dataRows = $(textareaElement).attr('rows');
            var dataMinRows = $(textareaElement).attr('data-min-rows');
            if (dataRows > 0 && dataMinRows > 0) {
                minRows = Math.max(dataRows, dataMinRows);
            } else if (dataRows > 0) {
                minRows = dataRows;
            } else if (dataMinRows > 0) {
                minRows = dataMinRows;
            } else {
                minRows = 1;
            }
            var maxRows = $(textareaElement).attr('data-max-rows') ? $(textareaElement).attr('data-max-rows') : null;

            if (_this.rows && _this.minRows) {
                minRows = Math.max(_this.rows, _this.minRows, minRows);
            } else if (_this.rows) {
                minRows = Math.max(_this.rows, minRows);
            } else if (_this.minRows) {
                minRows = Math.max(_this.minRows, minRows);
            }

            if (_this.maxRows && maxRows !== null) {
                maxRows = Math.min(_this.maxRows, maxRows);
            } else if (_this.maxRows) {
                maxRows = _this.maxRows;
            }

            if (minRows !== null) {
                var minHeight = singleRowHeight * minRows;
                if (boxSizing === 'border-box') {
                    minHeight = minHeight + paddingSize + borderSize;
                }
                height = Math.max(minHeight, height);
            }
            if (maxRows !== null) {
                var maxHeight = singleRowHeight * maxRows;
                if (boxSizing === 'border-box') {
                    maxHeight = maxHeight + paddingSize + borderSize;
                }
                height = Math.min(maxHeight, height);
            }
            // 将得到的height的高度设置到当前的textarea上面
            $(textareaElement).css('height', height + 'px');
        }
    }

    $.fn.autoHeightTextarea = function(options) {
        var options = $.extend({}, $.fn.autoHeightTextareaDefaults, options);

        this.each(function(index, textareaElement) {
            var hiddenTextarea;
            // 进入页面的初始化操作
            if (!hiddenTextarea) {
                hiddenTextarea = document.createElement('textarea');
                document.body.appendChild(hiddenTextarea);
            }
            options.mainAlgorithm(hiddenTextarea, textareaElement);
            hiddenTextarea.parentNode && hiddenTextarea.parentNode.removeChild(hiddenTextarea);
            hiddenTextarea = null;

            $(textareaElement).on("focus", function() {
                if (!hiddenTextarea) {
                    hiddenTextarea = document.createElement('textarea');
                    document.body.appendChild(hiddenTextarea);
                    hiddenTextarea.setAttribute('style', options.HIDDEN_STYLE);
                }
            }).on('input', function() {
                options.mainAlgorithm(hiddenTextarea, textareaElement);
            }).on('blur', function() {
                // 删除掉无用的隐藏的textarea
                hiddenTextarea.parentNode && hiddenTextarea.parentNode.removeChild(hiddenTextarea);
                hiddenTextarea = null;
            })
        });
        return this;
    }

})(jQuery);