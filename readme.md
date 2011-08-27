yajtagger
=============
_Yet another jQuery tagger_. I wasn't happy with any of the jQuery
plugins for tag-editing that I found, so I wrote my own.

The basic ideas for yajtagger:

* Maintain keyboard accessibility, the UI should be friendly to keyboard-only operators.
* Gracefully degrade. If Javascript is disabled, that's fine because the underlying element
   is a textbox where you can just type your tags. If the CSS is missing, the tags are 
   neatly lined up in an ul with the textbox at the bottom.
* The "remove"-link is not an image, it uses a unicode "x", so it doesn't rely on images.
* Make adding/removing tags programmatically accessible through public methods.
* Always parse the value-attribute of the textbox on init to pre-populate tags.

Demo and documentation
----------------

Please download the source and see demo.html for now. I plan to upload the demo
somewhere so you won't have to download it.

There is no documentation yet (because there aren't rellay any advanced options as of yet).
See _scripts/yajtagger.js_ for some reference/explanation in the meantime.

Planned features
----------------

### Localization

As for now, there are some hard coded labels in swedish. I plan to make it localizable
by passing strings to the init-method. This will be my first priority.

### Public events

Implement events so that you can get a callback when

* A tag is added
* A tag is removed
    
License
-------

Licensed under the MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this 
software and associated documentation files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.