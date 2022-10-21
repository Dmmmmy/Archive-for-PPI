/*
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	doSomethingWith(request).then(sendResponse);
	return true; // return true to indicate you want to send a response asynchronously
  });
  
  async function doSomethingWith(request) {
	var key = await getKey();
	// await .....
	return key;
  }
*/

//alert(_url);
function generateSummary(){
    function reqListener () {
		data = JSON.parse(this.responseText);
		console.log(data.annotations);
        chrome.runtime.sendMessage({action: "result", summary: this.responseText});
        console.log(this.responseText);
    }
    var _url = "127.0.0.1:8000/analyze"
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", _url);
	oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send();
    //console.log(_url);
}
chrome.runtime.onMessage.addListener(function(message){
    if(message.action === 'generate'){
        // console.log("inside contentScirpt...");
        generateSummary();
    }
});

/*

function getResultFromStorage(keys = []) {
    return new Promise(resolve => {
        //读缓存
        chrome.storage.sync.get(keys, result => {
            resolve(result)
        })
    })
}

function getURL() {
    return new Promise(async (resolve, reject) => {
        try {
            // 先从缓存拿token
            const accessToken = await getResultFromStorage(["key"]);           
            resolve(accessToken);
            console.log(accessToken);
        } catch (error) {
            reject(error)
        }
    })
}

window.addEventListener('load', getURL());//得加个监听器

//不同网页console显示的结果不一样


chrome.runtime.onMessage.addListener(function(message){
    if(message.action === 'analyze'){
        // console.log("inside contentScirpt...");
        generateSummary(document.getElementById('unknown_url').value);
    }
});

window.addEventListener('load', function load(event){
	var createButton = document.getElementById('submit');
	createButton.addEventListener('click', function() { 
		input = document.getElementById('unknown_url').value;
		if (input ===""||input ===null||input ===undefined)
		{
			alert("Can't be empty!")
		}
		else{
			alert("Successfully submit! The model is analyzing...");
		}
	});
})*/



