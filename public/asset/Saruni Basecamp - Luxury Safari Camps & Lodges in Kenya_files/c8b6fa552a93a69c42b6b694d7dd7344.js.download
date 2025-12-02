document.addEventListener("contextmenu",kpg_nrci_cm,!1);if(nrci_opts.drag=='1'){document.addEventListener("dragstart",kpg_nrci_cm,!1);document.addEventListener("touchmove",kpg_nrci_cm,!1)}
if(nrci_opts.touch=='1'){document.addEventListener("touchstart",kpg_nrci_cm,!1)}
if(nrci_opts.gesture=='1'){document.addEventListener("gesturestart",kpg_nrci_cm,!1)}
function kpg_nrci_block(event){event.cancelBubble=!0;if(event.preventDefault!=undefined){event.preventDefault()}
if(event.stopPropagation!=undefined){event.stopPropagation()}
return!1}
function kpg_nrci_cm(event){try{if(event.target.tagName=="IMG"){event.cancelBubble=!0;if(event.preventDefault!=undefined){event.preventDefault()}
if(event.stopPropagation!=undefined){event.stopPropagation()}
return!1}}catch(error){console.log("NRI error:"+error)}
try{if(event.target.getAttribute("style")==null||event.target.getAttribute("style")==""){return!0}
if(event.target.style.backgroundImage!=null&&event.target.style.backgroundImage!='none'&&event.target.style.backgroundImage!=''){event.cancelBubble=!0;if(event.preventDefault!=undefined){event.preventDefault()}
if(event.stopPropagation!=undefined){event.stopPropagation()}
return!1}}catch(error){console.log("NRI error:"+error)}
return!0}