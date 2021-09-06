function displayList(data)
{
    data=data.split(",");
    var ds="<ul class='cer pl-3'>";
    for(var i=0;i<data.length;i++)
    {
        d=data[i];
        if(d!=="" && d!==null && d!==undefined)
            ds+="<li>"+d+"</li>";
    }
    ds+="</ul>";
    return ds;
}
function SymptomsToArray(data)
{
    data=data.split(",");
    let array = [];
    for(var i=0;i<data.length;i++)
    {
        d=data[i];
        if(d!=="" && d!==null && d!==undefined)
            array.push(d);
    }
    return array;
}
function displayLog(d)
{
    var ds="<ul class='cer pl-3'>";
    ds+="<li> IP : "+d.ip+"</li>";
    ds+="<li> City : "+d.city+"</li>";
    ds+="<li> Region : "+d.region+"</li>";
    ds+="<li> Country : "+d.country+"</li>";
    ds+="<li> Localisation : "+d.loc+"</li>";
    ds+="<li> ISP : "+d.org+"</li>";
    ds+="<li> Time : "+d.time+"</li>";
    ds+="</ul>";
    return ds;
}
function graphsTracer()
{
            $.ajax({
                type:"GET",
                async:false,
                url:"/api/getSymptomsRecords",
                dateType:"json",
                success:function(data)
                {
                    let datos_d = [];
                    let datos_s = [];
                    let datos_c = [];
                    data.forEach(function(d){
                    	if(datos_d[d.Disease]===null || datos_d[d.Disease]===undefined)
                    	    datos_d[d.Disease]=0;
                    	datos_d[d.Disease]++;
                    	if(datos_c[d.country]===null || datos_c[d.country]===undefined)
                    	    datos_c[d.country]=0;
                    	datos_c[d.country]++;
                    	let symptoms = SymptomsToArray(d.SymptomsSeparatedByComma);
                    	symptoms.forEach((dd)=>{
                    	    if(datos_s[dd]===null || datos_s[dd]===undefined)
                        	    datos_s[dd]=0;
                        	datos_s[dd]++;
                    	});
                    });
                    datos_d.sort((a,b)=>{
                      return b-a;
                    });
                    let labels = [];
                    let values = [];
                    datos_s.sort((a,b)=>{
                      return b-a;
                    });
                    let i=0;
                    for(var d in datos_s){
                        if(i>5)
                            break;
                        i++;
                        labels.push(d);
                        values.push(datos_s[d]);
                    };
                    grapheDougnut(labels,values,"SP");
                    labels = [];
                    values = [];
                    for(var d in datos_c){
                        labels.push(d);
                        values.push(datos_c[d]);
                    };
                    grapheDougnut(labels,values,"CT");
                    labels = [];
                    values = [];
                    for(var d in datos_d){
                        labels.push(d);
                        values.push(datos_d[d]);
                    };
                    grapheBar(labels,values,"DS",duplicate('rgba(54, 162, 235, 1)',labels.length),duplicate('rgba(54, 162, 235, 0.4)',labels.length),"Diseases");
                    console.log(datos_d,datos_c,datos_s);
                },
                error:function(xhr)
                {}
            });
}
$(document).ready(()=>{
    table = $("#tableToManupilate").DataTable({
				"scrollX": true,
				"language": { "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/French.json" },
				"ajax": {
					url:"/api/getSymptomsRecords",
					cache: false,
					dataSrc: ''
				},
				"aaSorting": [],
				"lengthMenu": [[10, 25, 50,100, -1], [10, 25, 50, 100 , "Tous"]],
				"columns":[
					{"data": null, "render": function(data){
						return "";
					}},
					{"data": "Disease"},
					{"data": "SymptomsSeparatedByComma","render":function(d){
						return displayList(d);
					}},
					{"data": null,"render":function(d){
						return displayLog(d);
					},"width": "30%"}
				],
				responsive: true,
				dom:'Blfrtip',
				buttons: [
					{
						text: 'Actualiser',
						action : (e, dt, node, config)=>{
							table.ajax.reload();
							graphsTracer();
						}
					},
					{
						extend: 'copyHtml5',
						text: 'Copier',
						key: {
						key: 'c',
						ctrlKey: true
						}
					},
					'excelHtml5',
					'excel'
				],        
				columnDefs: [ {
					orderable: false,
					className: 'select-checkbox',
					targets:   0,
					data: null,
					defaultContent: ''
				} ],
				select: {
					style:    false,
					selector: 'td:first-child'
				},
				order: [[ 1, 'asc' ]]
			});
			graphsTracer();
});