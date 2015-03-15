#!/usr/bin/env node
var List = require('term-list');
var exec = require('child_process').exec;
var EventProxy = require('eventproxy');
var request = require('request');


var list = new List({
  maker: '\033[36m› \033[0m',
  makerLength: 2
})

console.error('Fetching hot topics...')

request('https://www.v2ex.com/api/topics/hot.json',function(err,res,body){
  if(!err){
    var topics = JSON.parse(body);
    var ep = new EventProxy();

    ep.after('add',topics.length,function(i){
      list.start();
      list.on('keypress',function(key,item){
        switch(key.name){
          case 'return':
            exec('open ' + item.replace('http','https'))
            break;
          case 'backspace':
            list.stop();
            break;
        }
      })
    })

    for (var i = 0; i < topics.length; i++) {
      list.add(topics[i].url,topics[i].title);
      ep.emit('add')
    };
  } else {
    console.error(err)
  }
})