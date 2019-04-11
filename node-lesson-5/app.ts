import async = require("async")

let current_thread_num=0;
let FetchURL = function(url,callback){
  let delay = (Math.random()*10000000)%2000;
  current_thread_num++;
  console.log("num",current_thread_num,"fetch",url,"delay",delay);
  setTimeout(function(){
    current_thread_num--;
    callback(null,url+"some data");
  },delay);
};

let urls=[]
for(let i=0;i<30;i++){
  urls.push("http://test.domain/no_"+i);
}

async.mapLimit(urls,5,function(url,callback){
  FetchURL(url,callback);
},function(err,result){
  console.log(result);
})