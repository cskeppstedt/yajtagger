/**************************************************************************************************
*   Yajtagger - Yet Another Jquery Tagger
*   A (gracefully?) degrading tagging widget
*
*   Copyright © Christoffer Skeppstedt 2011
*   
*   Permission is hereby granted, free of charge, to any person obtaining a copy of this 
*   software and associated documentation files (the "Software"), to deal in the Software without
*   restriction, including without limitation the rights to use, copy, modify, merge, publish, 
*   distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
*   Software is furnished to do so, subject to the following conditions:
*     
*   The above copyright notice and this permission notice shall be
*   included in all copies or substantial portions of the Software.
*
*   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
*   BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
*   NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
*   DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
*   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**************************************************************************************************/

(function ($) {

    var defaults = {
    };

    
    //  --- PRIVATE methods -----------------------------------------------------------------------


    //  --- Parses the value-attribute of the text-field and builds the tag elements.
    var parseInitialValue = function (self) {
        methods.parseString(self.val());
    };

    //  --- Returns true if the tag collection contains the specific tag (case insensitive).
    var hasTag = function (self, tag) {
        var tag = $.trim(tag || "").toLowerCase();
        var tags = self.data('yajtagger').tags;

        for (var i = 0; i < tags.length; i++) {
            if (tags[i] == tag)
                return true;
        }

        return false;
    };

    //  --- Removes the tag-element from the list of tags. If focusNext is true, the following tag
    //  --- link will be focused. Otherwise (default) the previous tag link will be focused.
    //  --- If there are no more tag-elements, the input box will be focused.
    var removeTagElement = function (self, link, focusNext) {
        var parent = link.closest('li');
        var prevLink = parent.prev('li').find('a');
        var nextLink = parent.next('li').find('a');

        if (focusNext === true && nextLink.length == 1)
            nextLink.focus();
        else if (prevLink.length == 1)
            prevLink.focus();
        else
            self.data('yajtagger').widget.input.focus();

        parent.fadeOut('fast', function () {
            parent.remove();
        });
    };

    //  --- Constructs and returns a jQuery-wrapper <li> with a tag-span and a remove-link.
    var buildTagItem = function (self, tagValue) {

        var removeLink = $('<a />')
            .text('\xd7').attr({
                href: '#',
                title: 'Ta bort den här taggen'
            })
            .click(function (e) {
                methods.removeTag(self, tagValue, $(this));
                self.data('yajtagger').widget.input.focus();
                return false;
            }).keydown(function (e) {
                var parent = $(this).closest('li');
                var intercept = false;
                var newFocus;

                switch (e.keyCode) {
                    case 37:    // left arrow
                        newFocus = parent.prev('li').find('a');
                        intercept = true;
                        break;
                    case 39:    // right arrow
                        newFocus = parent.next('li').find('a');
                        intercept = true;
                        if (newFocus.length == 0)
                            newFocus = self.data('yajtagger').widget.input;
                        break;
                    case 8:     // backspace
                        methods.removeTag(self, tagValue, $(this));
                        return false;
                    case 13:    // enter
                    case 46:    // delete
                        methods.removeTag(self, tagValue, $(this), true);
                        return false;
                }

                if (intercept) {
                    if (newFocus && newFocus.length == 1)
                        newFocus.focus();

                    return false;
                }
            });

        return $('<li />')
            .addClass('yajtagger-tag')
            .append($('<span />')
                .text(tagValue)
                .attr('title', tagValue)
            )
            .append(removeLink)
            .click(function () {
                $(this).find('a').focus();
            });
    };

    //  --- Call this function when the internal tag-collection has changed to update the 
    //  --- value of the original textbox.
    var tagsChanged = function (self) {
        var tags = self.data('yajtagger').tags;
        self.val(tags.join(','));
    };

    var tryAddTag = function (self, tag) {
        if (methods.addTag(self, tag)) {
            tagsChanged(self);
            self.data('yajtagger').widget.input.val('');
        }
    };


    //  --- PUBLIC methods ------------------------------------------------------------------------


    var methods = {};

    //  --- Inits the textbox to become a tagger widget.
    methods.init = function (self, opts) {
        // already initialized?
        if (self.data('yajtagger'))
            return self;

        var options = {};
        $.extend(options, defaults, opts);

        self.data('yajtagger', {
            options: options,
            widget: {},
            tags: []
        });

        self.data('yajtagger').widget.list = $('<ul />')
            .addClass('yajtagger')
            .insertAfter(self);

        self.data('yajtagger').widget.input = $('<input />')
            .attr({
                type: 'text',
                autocomplete: 'off',
                title: 'Klicka här och skriv en ny tagg',
                spellcheck: 'false'
            })
            .watermark('Lägg till tagg', {
                useNative: false,
                className: 'watermark'
            })
            .keydown(function (e) {
                switch (e.keyCode) {
                    case 9:     // tab
                        if ($.trim($(this).val()) != '') {
                            // intercept the tab event only if there is something in the textbox
                            tryAddTag(self, $(this).val());
                            return false;
                        }
                        break;
                    case 13:    // enter
                    case 32:    // space bar
                    case 188:   // comma
                        // always intercept these events
                        tryAddTag(self, $(this).val());
                        return false;
                    case 8:     // backspace
                    case 37:    // left arrow
                        if ($(this).val() == '') {
                            var lastTag = $(this).closest('li').prev('li').find('a');
                            if (lastTag.length == 1) {
                                lastTag.focus();
                                return false;
                            }
                        }
                }
            });

        $('<li />')
            .addClass('yajtagger-input')
            .append(self.data('yajtagger').widget.input)
            .appendTo(self.data('yajtagger').widget.list);

        self.hide();

        parseInitialValue(self);

        return self;
    };

    //  --- Adds the tag to the collection if it does not already exist (case insensitive).
    //  --- The tag is prefixed with a hash (#) if it isn't already.
    methods.addTag = function (self, tagValue) {
        tagValue = $.trim(tagValue || "");

        if (tagValue.charAt(0) != '#')
            tagValue = '#' + tagValue;

        if (tagValue.length <= 1 || hasTag(self, tagValue))
            return self;

        self.data('yajtagger').tags.push(tagValue);

        var lastItem = self.data('yajtagger').widget.input.closest('li');
        buildTagItem(self, tagValue).insertBefore(lastItem);

        return self;
    };

    //  --- Adds an array of tags by calling addTag for each tag.
    methods.addTags = function (self, tags) {
        if (tags && tags.length > 0)
            $.each(tags, function (i, t) { methods.addTag(self, t); });

        return self;
    }

    //  --- Removes the tag from the collection. Also removes the corresponding element from the list.
    //  --- You can pass the corresponding remove-link as the link parameter to remove a specific element.
    //  --- Otherwise, the element is found based on the tag. If focusNext is true, the following tag
    //  --- link will be focused. Otherwise (default) the previous tag link will be focused.
    //  --- If there are no more tag-elements, the input box will be focused.
    methods.removeTag = function (self, tag, link, focusNext) {
        tag = $.trim(tag || "");

        var tags = self.data('yajtagger').tags;
        for (var i = 0; i < tags.length; i++) {
            if (tags[i] == tag) {
                tags.splice(i, 1);
                tagsChanged(self);
                break;
            }
        }

        if (link == undefined || link.length == 0)
            link = self.data('yajtagger').widget.list.find('li span[title="' + tag + '"]');

        if (link && link.length == 1)
            removeTagElement(self, link, focusNext);

        return self;
    };

    //  --- Removes the local data and added elements, and restores the original textbox.
    methods.destroy = function (self) {
        self.data('yajtagger').widget.input.remove();
        self.data('yajtagger').widget.list.remove();
        self.removeData('yajtagger');
        self.show();

        return self;
    };

    //  --- Removes all tags from the widget and the underlying textbox.
    methods.clear = function (self) {
        self.data('yajtagger').widget.list.find('li').not('.yajtagger-input').remove();
        self.data('yajtagger').tags = [];
        tagsChanged(self);
        return self;
    };

    //  --- Takes a comma-delimited string of tags and adds them to the backing store.
    methods.parseString = function (self, str) {
        var value = $.trim(str || "");
        var tags = value.split(',');
        return methods.addTags(self, tags);
    };

    //  --- Method "routing" ----------------------------------------------------------------------

    $.fn.yajtagger = function (method) {
        var args = arguments;
        return this.each(function () {
            var self = $(this);

            if (methods[method]) {
                args = Array.prototype.slice.call(args, 1);
                args.unshift(self);
                return methods[method].apply(this, args);
            } else if (typeof method === 'object' || !method) {
                return methods.init.apply(this, [self, method]);
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.yajtagger');
            }
        });
    }
})(jQuery);
