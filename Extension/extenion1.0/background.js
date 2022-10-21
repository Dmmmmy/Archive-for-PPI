chrome.runtime.onMessage.addListener(
    function(response, sender, sendResponse) {     
        console.log("Entered");
        const response_obj = JSON.parse(response);
        console.log(typeof(response_obj['url']));
        var str = response_obj['url'];//.replace(/\"/g,"'");  
        //response_obj['url'].replace(/'/g, '"');
        console.log(str);
        //var json = eval("(" + response_obj['url'] + ")");
        if (response_obj['type'] == "newScraping") {
            console.log('into judge');
            var send_data = {
                'analyze':str
            };
            var settings = {
                "async": true,
                "crossDomain": true,
                "mode": 'cors',
                "url": 'https://ppi.ifi.uzh.ch/backend/', //https://ppi.ifi.uzh.ch/backend
                "method": 'POST',
                "headers": {
                  "Content-type": "application/json"
                }
                //"analyze": JSON.stringify(str)//
            }
            var xhttp = new XMLHttpRequest();
            var post_data = JSON.stringify({"analyze": encodeURIComponent(str)});
            console.log(post_data);
  	        xhttp.open(settings.method, settings.url, settings.async);
	        xhttp.setRequestHeader("Content-type", "application/json");
	        xhttp.send(post_data);//settings.analyze
        /*
            $.ajax({
                url: "https://ppi.ifi.uzh.ch/backend/",//
                type: "POST",
                async: true,
                //url: "/process_qtc",
                data: JSON.stringify(send_data),
                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                success: function(data, textStatus){
                    alert("success!"); 
                }
            });
            
        */
        }
    }
);

/*
async function getLocalStorageValue(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(key, function (value) {
                resolve(value);
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
}

const result = await getLocalStorageValue("key");

function getValue(callback) {
    chrome.storage.sync.get('key', callback);
  }

getValue(function (value) {
    console.log(value);
  }); 
 
async function run() {
    let value = await chrome.storage.sync.get('key');
    console.log('value', value)
    
    //await session.set(key, value) 
}
run()
*/