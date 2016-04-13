                  var fs = require('fs');
                  function myFunction() {

                    var url = "";
                    var c = document.createElement("canvas");
                    c.width = 500;
                    c.height = 500;
                    var ctx = c.getContext("2d");

                    console.log(ctx);

                    var gif = new GIF({
                        workers: 1,
                        workerScript: "../gif/gif.worker.js",
                        width: 500,
                        height: 500,
                        repeat:0,
                        background: "#fff"
                      });

          

                    gif.on('finished', function(blob) {                      
                      var img = document.getElementById("result");
                      img.src = URL.createObjectURL(blob);

                      // console.log(blob);
                      // var form = new FormData();
                      // var request = new XMLHttpRequest();
                      
                      // form.append("image", blob, "gif-roulette.gif");
                      // request.open("POST", "/upload", true);
                      // request.send(form);

                      // var reader = new window.FileReader();
                      // reader.readAsDataURL(blob); 
                      // reader.onloadend = function() {
                      //     var base64data = base64data + reader.result;    
                      //     $.post("/save", {"data" : base64data});            
                      //   }
                	 
                      var file = new File([blob], "something.gif", {type: "image/gif"});
                      var a = c.toDataURL("image/gif");
                      var data = a.replace(/^data:image\/\w+;base64,/, ""); 
                      var buf = new Buffer(data, 'base64'); 
                      var hh = fs.writeFile('image.gif', buf);
                      console.log(hh);
                     $.post("/upload", {"data": file});
                    });
                    
                    
                    ctx.font = "30px Arial";
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
      
                    var counter = 1;
                    while(true){

                      ctx.fillStyle = "#fff";
                      ctx.fillRect(0, 0, 500, 500);
                      ctx.fillStyle = "#000";
                      ctx.fillText(document.getElementById("topic").value,250,50);

                      var choiceId = "choice" + counter;
                      if(document.getElementById(choiceId)==null){
                        break;
                      }
                      else{
                        ctx.fillText(document.getElementById(choiceId).value,250,250);
                      }
                      gif.addFrame(ctx,{copy: true, delay: 50}); 
                      ctx.clearRect(0, 0, 500, 500);
                      counter++;
                    }
                    gif.render();
                  }


                  function download(){
                    console.log("Rawrwww");
                      var img = document.getElementById("result");
                      if(img.src !== null || img.src != ""){
                        console.log("YEYYY");
                        var a = document.createElement("a");
                        a.href = img.src;
                        a.download = "image.gif";
                        a.click();
                        window.URL.revokeObjectURL(img.src);
                      }
                  }