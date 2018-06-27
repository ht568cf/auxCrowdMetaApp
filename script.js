$(document).ready(function () {
    var obj = this;
    var dataInputArray =[];

    
    $('#run').click(function(){
        CrowdApp.run($("#txtData").val(), "metaCrowdApp/config.json", "#log" );
    });
    $("#makeGraph").click(function(){
        printGraph($("#graphIdxIn").val());
    });  
    $("#loadFromDoc").click(function(){
        $('#fileInput').click();
    });  

    $("#help").click(function(){
        alert("Pagina para auxiliar o teste do artefato.\n\nCarrega o aplicativo, dados valores do campo de texto:\n- Se vazio, usa referências padrões.\n- Se texto, executa para cada referência, separadas por nova linha).\n- Se url, tenta requisitar as referências no servidor.(erro)\n\n*Em caso de multiplas entradas o aplicativo ira analizar todas as entradas, antes de retornar uma resposta.")
    });

    $("#makeConfig").click(function(){
        $.getJSON("metaCrowdApp/config.json",function(responseJson) {
            $("#log").html(
                $("<pre>",{
                html: JSON.stringify(responseJson, undefined, 2)
                })
            );
        })
       
    });
    
    $("#fileInput").change(function () {
        if ($(this).val().split('.').pop()=='txt') {
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#txtData").val(e.target.result).trigger('propertychange');
            };
            reader.readAsText($(this)[0].files[0]);
        }
    });

    $("#txtData").bind('input propertychange', function() {
        dataInputArray = CrowdApp.validateInput($(this).val());
        if(dataInputArray.length>0){
            $("#txtDataInfo").html(dataInputArray.length)
            return true
        }
        url = CrowdApp.isUrl($(this).val());
        console.log(url)
        if(url){
            $("#txtDataInfo").html("url")
            return true
        }
        
        $("#txtDataInfo").html("")     
    });
});

function test() {
    CrowdApp._getPontuactionIdx(".")
}

function printGraph(idx){
    var types=[]
    var fields=[]
    $.ajax({
        dataType: "json",
        url: "metaCrowdApp/metaTest.json",
        success: function(responseJson) {
            types=responseJson.types;
            fields=responseJson.fields;
        },
        async:false
    });
    console.log(idx)
    var leg = "0 | .</br>1 | ,</br>2 | :</br>3 | ;</br>4 | (</br>5 | )"
    $("#log").empty().append(types[idx].name, $("<div>",{style:"position:absolute", html: leg })).append($("<div>",{id:"graph"}))

    var i,
    s,
    N = 2,
    E = 10,
    g = {
      nodes: [],
      edges: []
    };

    var countAux = 0

    for (const nodeIdx in types[idx].graph) {
        var label = fields[nodeIdx]?fields[nodeIdx].name:"beguin";
        g.nodes.push({
            id: 'n' + nodeIdx,
            label: label,
            x: countAux*0.2,
            y: (countAux%2*-1)*0.4,
            size: 10,
            color: "#617db4"
        });
        countAux++
    }
    countAux = 0

    for (const nodeIdx in types[idx].graph){
        for (const nodeOutIdx in types[idx].graph[nodeIdx]) {
            var edgeLabel =[]
            if (types[idx].graph[nodeIdx][nodeOutIdx].length>0){
                edgeLabel = types[idx].graph[nodeIdx][nodeOutIdx]
            }
            var text = edgeLabel.join(" | ")
            g.edges.push({
                id: 'e' + countAux,
                source: 'n' + nodeIdx,
                target: 'n' + nodeOutIdx,
                label: text,
                type:'curvedArrow',
                size: 1,
                color: '#b956af',
            });
            countAux++        
        }
    }

    s = new sigma({
        graph: g,
        renderer: {
            container: document.getElementById('graph'),
            type: 'canvas'
        },
        settings: {
            minNodeSize: 1,
            maxNodeSize: 10,
            minEdgeSize: 0.1,
            maxEdgeSize: 3,
            enableEdgeHovering: true,
            edgeHoverSizeRatio: 2,
            defaultLabelSize:15,
            minArrowSize:3,
        }
    });

    var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

    dragListener.bind('startdrag', function(event) {
    console.log(event);
    });
    dragListener.bind('drag', function(event) {
    console.log(event);
    });
    dragListener.bind('drop', function(event) {
    console.log(event);
    });
    dragListener.bind('dragend', function(event) {
    console.log(event);
    });
}