document.querySelector('#setting').addEventListener('click', function(event) {
	if (chrome.runtime.openOptionsPage) {
	  chrome.runtime.openOptionsPage();
	} else {
	  window.open(chrome.runtime.getURL('options.html'));
	}
  });

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url);
    hostname_0 = url.hostname;
    hostname = "http://"+hostname_0+"/";
    //console.log(hostname)
    // `hostname_0` now has a value like 'example.com'
  })

function website_setting(){
	var json_url = "json_sample.json";
    	var request_j = new XMLHttpRequest();
    	request_j.open("get",json_url);
    	request_j.send(null);
    	request_j.onload = function(){
        	if(request_j.status == 200){
            
            	var content = request_j.responseText
            	var json = JSON.parse(content);
            	console.log(json)
            	var wpanel = document.getElementById('webpanel');
            	var frag_w = document.createDocumentFragment();
            	arr_dom = []; 
            	arr_lab = [];
            	json.websites.forEach(function(item){ 
                	arr_dom.push(item.domain) 
                	arr_lab.push(item.annotations) 
            	}) 
            	console.log(arr_dom)
            	console.log(arr_dom.includes(hostname))
				
            	switch (arr_dom.includes(hostname)){
                	case true:
                    	var ind = arr_dom.indexOf(hostname)
                		var len_label = arr_lab[ind].length
                		console.log(`label ${len_label}`)
                		for(j=0;j<len_label;j++){
                    		var li = document.createElement("li");
                    		var Img = document.createElement("img"); 
							lab = arr_lab[ind][j]
                    		Img.src = "/icons/"+lab+".svg"; 
                			console.log(Img)
                    		//var ind = dom.indexOf(hostname)
                    		li.innerHTML = lab;
                    		frag_w.appendChild(Img)
                    		frag_w.appendChild(li)
                		}
                		wpanel.appendChild(frag_w);
                    	break;
                	case false:
                    	var p = document.createElement("p");
						var form = document.createElement("form");
						form.method = "POST";
                    	var input_box = document.createElement("input");
						//var input_button2 = document.createElement("input");
                    	input_box.style.width = "100px";
						input_box.id = 'unknown_url';
						//input_button2.type = "submit";
						form.appendChild(input_box);
						//form.appendChild(input_button2);
					
                    	var input_button = document.createElement("button");
                    	console.log("f")
                    	p.innerHTML = "The website is not in our list. Feel free to update us about the privacy policy link!";
                    	input_button.type = "button";
						input_button.innerHTML = "Submit";
						input_button.id = 'submit';
						
						input_button.onclick = function()
						{
							var url = document.getElementById("unknown_url").value;
							console.log(url);
							chrome.runtime.sendMessage(JSON.stringify({"type": "newScraping", 
							"url": url}), function(response) {
								
								return true;
							});
							/*console.log(url);
							url = JSON.stringify(url);
							chrome.storage.sync.remove(["key"]);
							chrome.storage.sync.set({"key": url}, function() {
								console.log(url);
							});*/
							alert('Submit successfully!')

						}
						
						//forma.appendChild(p);
                    	//frag_w.appendChild(p);
                    	//forma.appendChild(input_box);
                    	//forma.appendChild(input_button);
						frag_w.appendChild(p);
						frag_w.appendChild(form);
						frag_w.appendChild(input_button);
                    	wpanel.appendChild(frag_w);
                    	break;
            	}

            //ul.appendChild(frag)
            //console.log(websites.domain)
        
        	}
    	}
}


//var mydiv = document.createElement("div");
function user_setting(){
    var frag = document.createDocumentFragment();
	var ary = new String();
	chrome.storage.sync.get('setting',function(pre){	
		ary = pre.setting;
		console.log(ary);
		//arymust be in function
		var label;
    label = document.getElementsByName('data');
    //ary = JSON.parse(ary);
	console.log(ary);
	ary = ary.split(",");
	
    var imgSrcs = [];
	//display the icon
	for (var i = 0; i < ary.length; i++){
	
		if (ary[i] == 'y')
		{			
			continue;
		}
		else{
			console.log('here 0');
			var bigImg = document.createElement("img");	
			bigImg.src = "/icons/"+ary[i]+".svg";
			//bigImg.src="icons/006-pi-location-data.svg";  
			//bigImg.width="50"; 		
			imgSrcs.push(bigImg.src);
			//console.log('here 1');
			var li = document.createElement("li");
			li.innerHTML = ary[i];
			frag.appendChild(bigImg);
			frag.appendChild(li);
			//console.log(bigImg.src);
		}
			
	}
	var myul = document.getElementById('userpanel'); 
	//console.log(myul);
	myul.appendChild(frag); 
	console.log(frag);
	console.log(myul);
	})
}

window.onload = function (){
	user_setting();
	website_setting();
	document.getElementById("load").classList.add("loader");
	console.log('add loader successfully');
}

chrome.runtime.onMessage.addListener(function(message){
    if(message.action === 'result'){
        document.getElementById("load").classList.remove("loader");
        //document.querySelector(".text").innerHTML = message.summary;
    }
});