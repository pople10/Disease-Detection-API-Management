         const show___menu = () =>{
            var lfnvb=document.getElementById('lft_nvb');
            if(lfnvb.style.left=="-80vw"||lfnvb.style.left=="") lfnvb.style.left=0;
            else lfnvb.style.left="-80vw";
        }
        const afterLoading= () =>{
            document.getElementById('top___navbr').style.top=0;
            const header_=document.getElementsByClassName("backgroun___header")[0];
            header_.style.borderBottomLeftRadius="12%";
            header_.style.transform="rotate(-7deg)";
            document.getElementsByClassName("header___container__el1")[0].style.opacity=1;
            
        }
        const startLoading= () =>{
          $("body").append('<div class="loaderTmp" id="onl_____oad"> <div id="loading-ci"></div> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500" viewBox="0 0 500 500"> <defs> <lineargradient id="a" x1="30.03" y1="329.8" x2="469.94" y2="169.69" gradientUnits="userSpaceOnUse"> <stop offset="0.24" stop-color="#2196f3"></stop> <stop offset="0.49" stop-color="#1b90f5"></stop> <stop offset="0.83" stop-color="#0b80fb"></stop> <stop offset="1" stop-color="#0075ff"></stop> </lineargradient> <clippath id="c"> <path d="M484,249.76c0,129.21-104.78,234-234,234S16,379,16,249.76s104.76-234,234-234S484,120.51,484,249.76Z" style="fill:url(#a)"></path> </clippath> </defs> <title>Logo1</title> <g> <path d="M484,249.76c0,129.21-104.78,234-234,234S16,379,16,249.76s104.76-234,234-234S484,120.51,484,249.76Z" style="fill:url(#a)"></path> <g style="clip-path:url(#c)"> <path d="M250.9,411a16,16,0,0,1-14.73-9.75L177.33,262.47,155,349.58a16,16,0,0,1-30.66,1L86.49,235.88,76.14,293.4a16,16,0,0,1-15.75,13.13H-34.85a16,16,0,0,1-16-16,16,16,0,0,1,16-16H47L66.23,168.13A16,16,0,0,1,97.16,166L137.58,288.7l20.53-80a16,16,0,0,1,30.23-2.26l60.19,142,77-248.68A16,16,0,0,1,340.57,88.5a16.43,16.43,0,0,1,15.32,11l69.32,208.26L439.92,281a16,16,0,0,1,14-8.3h80.87a16,16,0,0,1,0,32H463.41l-27.8,50.54a16,16,0,0,1-29.17-2.67L341.28,156.82,266.17,399.7a16,16,0,0,1-14.47,11.22A7.22,7.22,0,0,1,250.9,411Z" style="fill:#fff"></path> </g> </g> </svg> </div>');
        };
        const stopTheFuckingLoader = () =>
        {
            $("#onl_____oad").remove();
        }
        $(document).ready(()=>{
            setTimeout(() => {afterLoading();}, 200);
            $(".addAPI").click(()=>{
                history.pushState({page: 2}, "ADD", "/addAPI");
                swal({
                  text: 'Add your API URI',
                  content: "input",
                  button: {
                    text: "Add",
                    closeModal: false,
                  },
                })
                .then(url => {
                  if (!url) throw null;
                        var formBody = [];
                        formBody.push(encodeURIComponent("uri") + "=" + encodeURIComponent(url));
                        formBody.push(encodeURIComponent("verb") + "=" + encodeURIComponent("GET"));
                        formBody = formBody.join("&");
                  return fetch('/api/API/add',{
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formBody
                    });
                })
                .then(results => {
                  return results.json();
                })
                .then(json => {
                  const result = json;
                  if (!result) {
                    return swal("Error!","Something went wrong!","error");
                  }
                 
                    const msg = result.message;
                    const flag = result.done==true?"success":"error";
                    const label = result.done==true?"Success":"Error";
                  swal({
                    title: label,
                    text: msg,
                    icon: flag,
                  });
                })
                .catch(err => {
                  if (err) {
                    swal("Error!", "Something went wrong with AJAX!", "error");
                  } else {
                    swal.stopLoading();
                    swal.close();
                  }
                })
                .finally(()=>{history.pushState({page: 1}, "AOT Detector", "/");});
            });
            $(".apisList").click(function(){
                history.pushState({page: 3}, "ADD", "/APIs/List");
                startLoading();
                fetch("/api/API/getAll")
                .then(results => {return results.json();})
                .then(result=>{
                    var message = "<table class='table'><thead style='color:white;' class='bg-primary'><tr><td>VERB</td><td>URL</td><td>SELECTED</td><td>STATUS</td></tr></thead><tbody>";
                    if(result.length===0 || result===null)
                        message+="<tr><td colspan='4'>No data is inserted yet.</td></tr>";
                    else
                    {
                        result.forEach(function(d)
                        {
                            message+="<tr>";
                            message+="<td><span class='btn btn-info'>"+d.verb+"</span></td>";
                            message+="<td>"+d.uri+"</td>";
                            message+="<td>"+(d.selected==="TRUE"?"Yes":"No")+"</td>";
                            $.ajax({url:d.uri,async:false,complete:function(xhr,textStatus){message+="<td>"+xhr.status+"</td>"}});
                            message+="</tr>";
                        });    
                    }
                    bootbox.dialog({ 
                        title: 'APIs List',
                        message: message,
                        size: 'large',
                        onEscape: true,
                        backdrop: true,
                        buttons: null,
                        onHide: function(e) {
                            history.pushState({page: 1}, "AOT Detector", "/");
                        }
                    });
                 })
                .catch(err=>{history.pushState({page: 1}, "AOT Detector", "/");console.log(err);swal("Error!","Something went wrong.","error");})
                .finally(()=>{stopTheFuckingLoader();});
            });
            $("#last___in___nav__bar,#last___in___nav__bar_mb").click(function(){
                history.pushState({page: 4}, "Change API", "/change");
                startLoading();
                fetch("/api/API/getAll")
                .then(results => {return results.json();})
                .then(result=>{
                    var urlInput = "<select class='form-control' id='URL_Change'><option value=''></option>";
                    var options = {};
                    result.forEach(function(d){
                        let url = d.uri;
                        options[url]=url;
                        let selected = d.selected==="TRUE"?"selected":"";
                        urlInput+="<option "+selected+" value='"+url+"'>"+url+"</option>";
                    });
                    urlInput+="</select>";
                    bootbox.dialog({ 
                        title: 'APIs List',
                        message: "<p>Select to modify</p>"+urlInput,
                        size: 'medium',
                        onEscape: true,
                        backdrop: true,
                        buttons: null,
                        centerVertical:true,
                        onHide: function(e) {
                            history.pushState({page: 1}, "AOT Detector", "/");
                        }
                    }).on('shown.bs.modal', function (e) {
                        $("#URL_Change").on("change",function(){
                            let value_URI = $(this).val();
                            if(value_URI!="" && value_URI!==null)
                            {
                                var formBody = [];
                                formBody.push(encodeURIComponent("uri") + "=" + encodeURIComponent(value_URI));
                                
                                $.ajax({
                                    url:'/api/API/change',
                                    type:"PUT",
                                    data:{uri:value_URI},
                                    dataType:"json",
                                    beforeSend:function()
                                    {
                                        startLoading();
                                    },
                                    success:function(result)
                                    {
                                        let msg = result.message;
                                        let flag = result.done;
                                        let label = flag==true?"success":"error";
                                        let labelTmp = flag==true?"Success!":"Error!";
                                        swal(labelTmp,msg,label);
                                    },
                                    error:function()
                                    {
                                        swal("Error!","Something went wrong","error");
                                    },
                                    complete:function()
                                    {
                                        stopTheFuckingLoader();
                                    }
                                });
                            }
                        });
                    });
                 })
                .catch(err=>{history.pushState({page: 1}, "AOT Detector", "/");console.log(err);swal("Error!","Something went wrong.","error");})
                .finally(()=>{stopTheFuckingLoader();});
            });
        });
        
        
        const TextAnimation = (e) => {
            e.classList.add("animated___text");
        }
        const TextAnimation_out = (e) => {
            e.classList.remove("animated___text");
        }
        const stopLoader=()=>{
          setTimeout(()=> $("#onl_____oad").remove(),300);  
        };