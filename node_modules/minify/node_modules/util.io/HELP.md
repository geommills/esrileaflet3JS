# Util.io [![NPM version][NPMIMGURL]][NPMURL]
[NPMIMGURL]:                https://badge.fury.io/js/util.io.png
[NPM_INFO_IMG]:             https://nodei.co/npm/util.io.png?downloads=true&&stars
[NPMURL]:                   https://npmjs.org/package/util.io "npm"

Util.io - utilites for vanila js. Consist of nice set of functions that works in node and browser.

## Install
For node:
```
npm i util.io
```
For browser:
```html
<script src="lib/util.js"
```

## Api

### bind

Same as ```Function.prototype.bind```, but for functions not methods

Before:
```js
    function showMessage(msg) {
        console.log(msg);
    }
    
    setTimeout(showMessage.bind(null, 'hello', 0));
```

After:
```js
    function showMessage(msg) {
        console.log(msg);
    }
    
    setTimeout(Util.bind(showMessage, 'hello'), 0);
```

### exec
Check is parameter is function, if it's - executes it with given parameters

Was:
```js
function(callback, p1, p2, pN) {
    if (typeof callback === 'function')
        callback(p1, p2, pN);
}
```

Now
```js
function(callback, p1, p2, pN) {
    Util.exec(callback, p1, p2, pN);
}
```
or just
```js
    Util.retExec(callback, p1, p2, pN);
```

### ifExec
Conditional execution one of two functions

Preconditions:
```js
    function one() {
        console.log(1);
    }
    
    function two(callback) {
        setTimeout(callback, 1000);
    }
```


Before:
```js
    if (2 > 3)
        one();
    else
        two(one);
    
```

After:
```js
    Util.ifExec(2 > 3, one, two);
```

### asyncCall
if a you need a couple async operation do same work, and then call callback, this function for you.

**Node.js example**.
```js
var fs = require('fs');

Util.asyncCall([
    function(callback) {
        fs.readFile('file1', function(error, data) {
            Util.exec(callback, error, data);
        });
    },
    function(callback) {
        fs.readFile('file2',  function(error, data) {
            Util.exec(callback, error, data);
        });
    }
], function(file1, file2) {
    var error1  = file1[0],
        data1   = file1[1]
        
        error2  = file1[0]
        data2   = file2[1];
    
    console.log(error1 || data1);
    console.log(error2 || data2);
});
```
**Vanilla js example.**
```js
var ONE_SECOND  = 1000,
    TWO_SECONDS = 2000,
    func        = function(time, str, callback) {
        setTimeout(function() {
            console.log(str);
            Util.exec(callback, str);
        }, time);
    },
    
    func1       = func.bind(null, TWO_SECONDS, 'first'),
    func2       = func.bind(null, ONE_SECOND, 'second');

Util.asyncCall([func1, func2], function(str1, str2) {
    console.log(str1, str2);
});
```

### loadOnLoad
executes functions one-by-one

```js
    function one(callback){
        setTimeout(function() {
            console.log(1)
            Util.exec(callback)
        }, 1000);
    }

    function two(callback) {
        console.log(2);
        Util.exec(callback)
    }

    Util.loadOnLoad([one, two]);
```



### render
simple template engine

```js
    var msg = Util.render('hello {{ word }}', {
        word: 'world'
    });
    
    console.log(msg);
    // hello world
```


```js
    /* template engine could be any you want */
    var msg;
    msg = Util.ownRender('hello <%word%>', { word: 'world' }, ['<%', '%>']);
    console.log(msg);
    // hello world
    
    /* if you want spaces */
    var notEscape = true;
    msg = Util.ownRender('hello <% word %>', { word: 'world' }, ['\\s*<%', '\\s*%>'], notEscape);
    console.log(msg);
    // hello world
    
    /* if you want functions */
    var sum = function(x, y) {
        return x + y
    };
    
    msg = Util.render('x = {{ result }}', {
        result: Util.bind(sum, 5, 3)
    });
    
    console.log(msg);
    // x = 8
```
