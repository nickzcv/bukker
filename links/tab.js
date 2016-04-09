function show_tab(pag2){
                    paga2=pag2.split(","); len=paga2.length;
                    tmp="<div align=center><div id=topmenu2>";
                    for(var i2=0;i2<len;i2++){paga2_s=paga2[i2].split("|");
                        tmp=tmp+' <span><a class="'+((paga2_s[0]==this_p2)?"tabactive2":"tab2")+'" href="'+paga2_s[0]+'.html">'+paga2_s[0]+(((paga2_s[1]*1)>1)?'<u class=noul> ('+paga2_s[1]+')</u>':'')+'</a></span>';
                    }
                    tmp=tmp+"</div></div>";
                    tmp="<table border=0 width=100% cellspacing=0 cellpadding=0><tr><td>"+tmp+"</td></tr></table>";
                    if (document.getElementById("sub_tab"))document.getElementById("sub_tab").innerHTML=tmp;
                }
                function show_h_tab(pag2){
                    paga2=pag2.split(","); len=paga2.length;tmp="";
                    for(var i2=0;i2<len;i2++){
                        tmp=tmp+' <span><a class="tab" href="'+paga2[i2]+'.html">'+paga2[i2].substring(0,1).toUpperCase()+'</a></span>';
                    }
                    tmp="<table border=0 width=100% cellspacing=0 cellpadding=0><tr><td>"+tmp+"</td></tr></table>";
                    if (document.getElementById("topmenu"))document.getElementById("topmenu").innerHTML=tmp;
                    if (document.getElementById("tit"))document.getElementById("tit").innerHTML="<div style=\"background-color:#0099FF;font-family:Tahoma, Arial, sans-serif;font-size:14px;color:#FFFFFF;font-weight:bold;padding:4px\">Список каталогов, в которых сайт регистрировался</div>";
                }