const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify=require('slugify');
const replaceTemplate = require('./starter/modulesjs/replaceTemplate');
////////////////////////////////////////////////////////////////
////File
// blocking way -synchronous
// const textin = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textin);

// const textout = `this is new definition of avocado:${textin}.\n Created on:${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textout);

// // non-blocking way -asynchronous
// fs.readFile('./starter/txt/output.txt', 'utf-8', (err, data) => {
//     console.log(data);
// })
// console.log('reading the file');
///////////////////////////////////////////////////////////////////
//////Server


const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slug=dataObj.map(el => slugify(el.productName,{lower:true}))
console.log(slug);
const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);
    // const path = req.url;
    //Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS', cardsHtml);
        // console.log(output);
        res.end(output);
    }

    //Productpage
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }

    //API 
    else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);
    }
    //NOT found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end("<h1>Page not found!</h1>");
    }

});
server.listen(8000, '127.0.0.1', () => {
    console.log('listening on port 8000');
})