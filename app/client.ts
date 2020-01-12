import { createElement, render, mount } from './lib/vdom/vdom';

const vApp = createElement('div', {
    id: 'app',
},
    [
        createElement('img', {
            src: 'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif',
        })
    ]
);

console.log('vApp', vApp);

const $app = render(vApp);
console.log($app);

mount($app, document.getElementById('root'));