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
            Ext.StoreManager.lookup("S_collection_thread").load({
                params:{
                    collection_id: (window.location.hash.split("/"))[1]
                }
            });
        }
    },
    
    layout: 'fit',
    
    items: [
        {
            xtype: 'grid',
            name:'collection_thread',
            store: 'S_collection_thread',
            hideHeaders: true,
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
                }
            ],
            columns: [
                {
                    dataIndex: 'closed_at',
                    flex: 0.5,
                    renderer: function(value,metaData,record){
                        if(value!=null){
                            var closed_by = record.get("closed_by"),
                                closed_by_name = record.get("closed_by_name"),
                                closed_at = record.get("closed_at");

                            var d = new Date(closed_at);
                            closed_at = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " " +
                                d.getHours() + ":" + d.getMinutes();

                            return '<img title="Discussione chiusa da '+closed_by_name+'(#'+closed_by+'), '+closed_at+'" src="images/icons/icon_lock.png" alt=" " height="20" width="20">';
                        }
                    }
                },
                { 
                    dataIndex: 'title',
                    flex: 10,
                    renderer: function(value,metaData,record){
                        var to_return = "",
                            prefix = record.get("prefix"),
                            title = record.get("title"),
                            created_by = record.get("created_by"),
                            created_by_name = record.get("created_by_name"),
                            created_at = record.get("created_at");

                        var d = new Date(created_at);
                        created_at = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " " +
                            d.getHours() + ":" + d.getMinutes();


                        if(prefix==null){
                            to_return = '<div style="font-weight: bold">'+title+'</div><i>Iniziata da <a style="color: #c70000 !important;" href="#user/'+created_by+'">'+created_by_name+' (#'+created_by+')</a>, '+created_at+'</i>';
                        }
                        else if(prefix=="[DOMANDA]"){
                            to_return = '<div style="color:blue; font-weight: bold;">'+prefix+'</div><div style="font-weight: bold">'+title+'</div><i>Iniziata da <a style="color: #c70000 !important;" href="#user/'+created_by+'">'+created_by_name+' (#'+created_by+')</a>, '+created_at+'</i>';
                        }
                        else {
                            to_return = '<div style="color:red; font-weight: bold;">'+prefix+'</div><div style="font-weight: bold">'+title+'</div><i>Iniziata da <a style="color: #c70000 !important;" href="#user/'+created_by+'">'+created_by_name+' (#'+created_by+')</a>, '+created_at+'</i>';
                        }

                        return to_return;
                    }
                },
                {
                    //dataIndex: 'title',
                    flex: 2,
                    renderer: function (value, metaData, record) {
                        return "11/12/2016 - 10:50"
                    }
                },
                {
                    //dataIndex: 'title',
                    flex: 1,
                    renderer: function (value, metaData, record) {
                        return "(24)"
                    }
                },
                {
                    xtype: 'actioncolumn',
                    width: 75,
                    items: [

                        {
                            iconCls: 'x-fa fa-lock',
                            tooltip: 'Chiudi',
                            handler: function(grid, rowIndex) {
                                var collection_id = (window.location.hash.split("/"))[1];

                                CL.app.getController("C_permessi").canWriteCollectionThread(collection_id, true,function(){
                                    var rec = grid.getStore().getAt(rowIndex);

                                    Ext.Msg.confirm('Attenzione!', 'Chiudere la discussione <b>"'+rec.get("title")+"\"</b>?<br>Non sarà più possibile rispondere con ulteriori messaggi!",function(btn){
                                        if (btn === 'yes'){
                                            rec.set({
                                                closed_by: Ext.util.Cookies.get("user_id")
                                            });
                                        }
                                    });
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
