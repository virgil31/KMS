Ext.define('CL.view.collection_thread.V_list_by_collection', {
    extend: 'Ext.panel.Panel',
    xtype: 'collection_thread_list_by_collection',
    itemId: 'collection_thread_list_by_collection_id',
    alias: 'widget.collection_thread_list_by_collection',

    title: 'Discussioni',
    icon: 'images/icons/icon_msg.png',
    bodyStyle: 'background: #484848',
    padding: 1,


    listeners: {
        activate: function(){
            setTimeout(function(){
                Ext.StoreManager.lookup("S_collection_thread").load({
                    params:{
                        collection_id: (window.location.hash.split("/"))[1]
                    }
                });
            }, 250);


            var collection_id = (window.location.hash.split("/"))[1];
            CL.app.getController("C_collection").redirectTo("collection/"+collection_id+"/threads");
        }
    },
    
    layout: 'fit',
    
    items: [
        {
            xtype: 'grid',
            name:'collection_thread',
            store: 'S_collection_thread',
            disableSelection: true,
            //hideHeaders: true,
            tbar: [
                {
                    xtype: 'panel',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Crea Nuova Discussione',
                            iconCls: 'x-fa fa-plus',
                            action: 'on_create'
                        }
                    ]
                },
                '->',
                {
                    xtype: 'label',
                    margin: '0 10 0 10',
                    html: '<a onclick="CL.app.getController(\'C_collection_thread\').showInfo(this);return false;" href="#" style="color: #963232 !important; font-weight: bold; font-size: large;" ><u>Cosa sono le Discussioni e chi può aprirle/rispondere?</u></a>'
                }
            ],
            columns: [
                {
                    dataIndex: 'closed_by',
                    flex: 1,
                    renderer: function(value,metaData,record){

                        var to_return = "";

                        // se è NUOVA
                        if(record.get("count_responses") == 0){
                            to_return += '<img title="Nuova Discussione!" src="images/icons/icon_new.ico" alt=" " height="20" width="20" style="margin-right: 5px;" >';
                        }

                        // se è stata creata da un COLLABORATORE o AMMINISTRATORE
                        if(record.get("is_coworker_or_admin")){
                            metaData.tdStyle = 'background: #FFEFBB;';
                            to_return += '<img title="Discussione di un Collaboratore/Amministratore" src="images/icons/icon_star.png" alt=" " height="20" width="20" style="margin-right: 5px;" >';
                        }

                        // se è stata CHIUSA
                        if(value!=0){
                            var closed_by = record.get("closed_by"),
                                closed_by_name = record.get("closed_by_name"),
                                closed_at = record.get("closed_at");

                            var d = new Date(closed_at);
                            closed_at = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " " +
                                d.getHours() + ":" + ((d.getMinutes()<10?'0':'') + d.getMinutes());

                            to_return += '<img title="Discussione chiusa da '+closed_by_name+'(#'+closed_by+'), '+closed_at+'" src="images/icons/icon_lock.png" alt=" " height="20" width="20" style="margin-right: 5px;" >';
                        }



                        return to_return;
                    }
                },
                {
                    text: 'Titolo Discussione',
                    dataIndex: 'title',
                    flex: 10,
                    renderer: function(value,metaData,record){
                        var to_return = "",
                            thread_id = record.get("id"),
                            prefix = record.get("prefix"),
                            title = record.get("title"),
                            created_by = record.get("created_by"),
                            created_by_name = record.get("created_by_name"),
                            created_at = record.get("created_at");

                        var d = new Date(created_at);
                        created_at = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " - " +
                            d.getHours() + ":" + ((d.getMinutes()<10?'0':'') + d.getMinutes());


                        if(prefix==null){
                            to_return = '<div style="font-weight: bold"><a  style="color:#404040 !important;" href="#collection_thread/'+thread_id+'"><u>'+title+'</u></a></div>' +
                                        '<i>Iniziata da <a style="color: #c70000 !important;" href="#user/'+created_by+'">'+created_by_name+' (#'+created_by+')</a>, '+created_at+'</i>';
                        }
                        else if(prefix=="[DOMANDA]"){
                            to_return = '<div style="color:blue; font-weight: bold;">'+prefix+'</div>' +
                                '<div style="font-weight: bold"><a  style="color:#404040 !important;" href="#collection_thread/'+thread_id+'"><u>'+title+'</u></a></div>' +
                                '<i>Iniziata da <a style="color: #c70000 !important;" href="#user/'+created_by+'">'+created_by_name+' (#'+created_by+')</a>, '+created_at+'</i>';
                        }
                        else if(prefix=="[GUIDA]"){
                            to_return = '<div style="color:green; font-weight: bold;">'+prefix+'</div>' +
                                '<div style="font-weight: bold"><a  style="color:#404040 !important;" href="#collection_thread/'+thread_id+'"><u>'+title+'</u></a></div>' +
                                '<i>Iniziata da <a style="color: #c70000 !important;" href="#user/'+created_by+'">'+created_by_name+' (#'+created_by+')</a>, '+created_at+'</i>';
                        }
                        else if(prefix=="[RICHIESTA MODIFICHE]"){
                            to_return = '<div style="color:#c47614; font-weight: bold;">'+prefix+'</div>' +
                                '<div style="font-weight: bold"><a  style="color:#404040 !important;" href="#collection_thread/'+thread_id+'"><u>'+title+'</u></a></div>' +
                                '<i>Iniziata da <a style="color: #c70000 !important;" href="#user/'+created_by+'">'+created_by_name+' (#'+created_by+')</a>, '+created_at+'</i>';
                        }
                        else {
                            to_return = '<div style="color:#d90000; font-weight: bold;">'+prefix+'</div>' +
                                        '<div style="font-weight: bold"><a  style="color:#404040 !important;" href="#collection_thread/'+thread_id+'"><u>'+title+'</u></a></div>' +
                                        '<i>Iniziata da <a style="color: #c70000 !important;" href="#user/'+created_by+'">'+created_by_name+' (#'+created_by+')</a>, '+created_at+'</i>';
                        }

                        if(record.get("is_coworker_or_admin"))
                            metaData.tdStyle = 'background: #FFEFBB;';

                        return to_return;
                    }
                },
                {
                    text: '#Risposte',
                    dataIndex: 'count_responses',
                    flex: 1.5,
                    renderer: function (value, metaData, record) {
                        if(record.get("is_coworker_or_admin"))
                            metaData.tdStyle = 'background: #FFEFBB;';

                        return '('+value+')'
                    }
                },
                {
                    text: 'Ultimo Messaggio',
                    dataIndex: 'last_message_at',
                    flex: 2.2,
                    renderer: function (value, metaData, record) {
                        if(record.get("is_coworker_or_admin"))
                            metaData.tdStyle = 'background: #FFEFBB;';

                        var d = new Date(value);
                        value = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " - " +
                            d.getHours() + ":" + ((d.getMinutes()<10?'0':'') + d.getMinutes());

                        return value
                    }
                },
                {
                    xtype: 'actioncolumn',
                    width: 75,
                    renderer: function (value, metaData, record) {
                        if (record.get("is_coworker_or_admin"))
                            metaData.tdStyle = 'background: #FFEFBB;';
                    },
                    items: [

                        {
                            iconCls: 'x-fa fa-lock',
                            tooltip: 'Chiudi',
                            handler: function(grid, rowIndex) {
                                var collection_id = (window.location.hash.split("/"))[1];

                                CL.app.getController("C_permessi").canWriteCollectionThread(collection_id, true,function(){
                                    var rec = grid.getStore().getAt(rowIndex);

                                    if(rec.get("closed_at")!=null)
                                        Ext.Msg.alert("Attenzione!","Questa discussione è già stata chiusa!");
                                    else{
                                        Ext.Msg.confirm('Attenzione!', 'Chiudere la discussione <b>"'+rec.get("title")+"\"</b>?<br><br>Non sarà più possibile rispondere con ulteriori messaggi ma rimarrà comunque consultabile!",function(btn){
                                            if (btn === 'yes'){
                                                Ext.Msg.prompt("Chiusura Discussione","Giustifica il motivo della chiusura:", function(btn, text){
                                                    if (btn == 'ok'){
                                                        rec.set({
                                                            closed_by: Ext.util.Cookies.get("user_id"),
                                                            close_message: text
                                                        });
                                                        Ext.StoreManager.lookup("S_collection_thread").sync();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });

                            }
                        },
                        {
                            iconCls: 'x-fa fa-trash',
                            tooltip: 'Elimina',
                            handler: function(grid, rowIndex) {
                                var collection_id = (window.location.hash.split("/"))[1];

                                CL.app.getController("C_permessi").canWriteCollectionThread(collection_id, true,function(){
                                    var rec = grid.getStore().getAt(rowIndex);

                                    Ext.Msg.confirm('Attenzione!', 'Eliminare definitivamente la discussione <b>"'+rec.get("title")+"\"</b>?",function(btn){
                                        if (btn === 'yes'){
                                            Ext.StoreManager.lookup("S_collection_thread").remove(rec);
                                            Ext.StoreManager.lookup("S_collection_thread").sync();
                                        }
                                    });
                                });
                            }
                        }
                    ]
                }
            ]
        }
    ]

});
