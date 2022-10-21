/*
let menuTabs = document.querySelectorAll(".header .menuitem")

menuTabs.forEach((menuTab) => {
    menuTab.addEventListener("click", (evt)=>{
        tabChanged(menuTab);
    });

    menuTab.addEventListener("keydown", (evt)=> {
        console.log(evt.code);

        let newTab = null;

        if(evt.code === "ArrowRight") {
            newTab = menuTab.nextElementSibling;
            if(newTab == null) {
                newTab = menuTabs[0];
            }
        } else if(evt.code === "ArrowLeft") {
            newTab = menuTab.previousElementSibling;
            if(newTab == null) {
                newTab = menuTabs[menuTabs.length - 1];
            }
        }
        if(newTab != null) {
            tabChanged(newTab);
        }
    });
});

function tabChanged(target) {
    let oldTab = document.querySelector(".header .menuitem[tabindex='0']");
    if(oldTab != null) {
        oldTab.setAttribute("tabindex", -1);
    }

    menuTabs.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-selected", false);
    });
    document.querySelectorAll(".tab").forEach((item) => {
        item.style.display = "none";
    });
    target.classList.add("active");
    target.setAttribute("aria-selected", true);
    target.setAttribute("tabindex", 0);

    document.querySelectorAll(".configurator .tab").forEach((tab)=>{
        tab.style.display = "none";
    });

    document.getElementById(target.getAttribute("aria-controls")).style.display = "block";

    target.focus();

    //updateLog();
}
*/
chrome.storage.sync.get('setting',function(pre){
	var ary = pre.setting;
	console.log(ary);
	var label;
    label = document.getElementsByName('data');
    //ary = JSON.parse(ary);
    if(ary==null) //set for first time
    {
        ary = "y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y"
    }
    ary = ary.split(",");//or it will consider the array as a string
    for (var i = 0; i < label.length; i++){
        
        for (var j = 0; j < ary.length; j++)
		{
            //console.log(label[i].getAttribute("value"));
			//console.log(ary[j]); 
			if (label[i].getAttribute("value") == ary[j])
			{
                label[i].setAttribute("checked", "checked");
				    //label[i].checked = true;
				break;
            }
        }
		//console.log(label[i].checked);
    }
    

})
$("#Save").click(function() {
	
	var arr = new Array();
	$("input:checkbox[name='data']:checked").each(function() {
		arr.push($(this).val()); //add element
	}); //get all checked value
	
	arrType = arr.join(','); //store the value in an array
	//alert(arrType);
	
	$.ajax({
		url: "options.html",
		data: {
			//deviceId : [1,2,3,4]
			deviceId: arrType
		},
		type: "GET",
		success: function(data) {console.log(data);},//
		error: function(err) {
			console.log(err);
		}
	})
	
	//Save
	//first get then set
	if(arrType){
		chrome.storage.sync.set({'setting': arrType}, function(){
			var status = document.getElementById('status');
	  		status.textContent = 'Options saved.';
	  		setTimeout(function() {
			status.textContent = '';
	  		}, 750);
	  		alert('Options saved.');
			close();})
	}
})