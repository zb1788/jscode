export async function appendScript(src) {
    return new Promise((resolve, reject) => {
        var script = document.createElement('script'),
            head = document.getElementsByTagName('body')[0];
        script.type = 'text/javascript';
        script.charset = 'UTF-8';
        script.src = src;
        if (script.addEventListener) {
            script.addEventListener('load', function () {
                resolve()
            }, false);
        } else if (script.attachEvent) {
            script.attachEvent('onreadystatechange', function () {
                var target = window.event.srcElement;
                if (target.readyState == 'loaded') {
                    resolve()
                }
            });
        }
        head.appendChild(script);
    })
}



