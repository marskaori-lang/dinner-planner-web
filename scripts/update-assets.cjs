'use strict';
// サイトのファイルを変更した後に実行。旧版の保存済みデータと混ざらないURLにする。
const fs=require('node:fs');const path=require('node:path');const {createHash}=require('node:crypto');
const root=path.join(__dirname,'..');
const files=['style.css','ingredients.js','recipes.js','app.js'];
const hash=createHash('sha256');for(const f of files)hash.update(f).update('\0').update(fs.readFileSync(path.join(root,f)));
const version=hash.digest('hex').slice(0,12);
const htmlFile=path.join(root,'index.html');let html=fs.readFileSync(htmlFile,'utf8');
for(const f of files)html=html.replace(new RegExp(`((?:src|href)="${f.replace('.','\\.')})(?:\\?v=[^"]*)?"`,'g'),`$1?v=${version}"`);
fs.writeFileSync(htmlFile,html);console.log('Updated asset version:',version);
