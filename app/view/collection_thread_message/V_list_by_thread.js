Ext.define('CL.view.collection_thread_message.V_list_by_thread', {
    extend: 'Ext.panel.Panel',
    xtype: 'collection_thread_message_list_by_thread',
    itemId: 'collection_thread_message_list_by_thread_id',
    alias: 'widget.collection_thread_message_list_by_thread',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    bodyStyle: {
        background: "transparent"
    },

    items: [
        {
            xtype: 'panel',
            width: '100%',
            margin: '10 0 0 0',
            bodyCls: 'mypanel',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {html:'<br>'},
                {
                    xtype: 'toolbar',
                    width: '100%',
                    style: 'background: transparent',
                    items: [
                        {
                            xtype: 'panel',
                            items: [
                                {
                                    xtype: 'button',
                                    tooltip: 'Aggiorna Discussione e scarica nuovi messaggi',
                                    iconCls: 'x-fa fa-refresh',
                                    cls: 'mybutton',
                                    handler: function () {
                                        alert("todo");
                                        /*var colletion_id = CL.app.getController("C_collection_file").collection_id;
                                        var file_id = CL.app.getController("C_collection_file").file_id;

                                        Ext.create('Ext.Component', {
                                            renderTo: Ext.getBody(),
                                            cls: 'x-hidden',
                                            autoEl: {
                                                tag: 'iframe',
                                                src: 'data/collection_file/download_single.php?file_id='+file_id+'&collection_id='+colletion_id
                                            }
                                        });*/
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            items: [
                                {
                                    xtype: 'button',
                                    tooltip: 'Condividi Discussione',
                                    icon: 'images/icons/icon_share.png',
                                    cls: 'mybutton',
                                    handler: function () {
                                        var targetEl = this;

                                        var thread_record = CL.app.getController("C_collection_thread_message").thread_record;

                                        CL.app.getController("C_collection_thread").share(targetEl,thread_record);
                                    }
                                }
                            ]
                        },
                        '->',
                        {
                            style: {
                                background: "transparent",
                                borderColor: "transparent"
                            },
                            html: '<img src="images/icons/icon_thread.png" alt=" " style="width:40px;height:40px;">'
                        },
                        {
                            xtype: 'label',
                            text:'title',
                            name: 'title',
                            style: {
                                color: 'white',
                                fontSize: 'medium',
                                fontWeight: 'bold'
                            }
                        },
                        '->',
                        {
                            xtype: 'panel',
                            items: [
                                {
                                    xtype: 'button',
                                    tooltip: 'Elimina collection_file',
                                    iconCls: 'x-fa fa-trash',
                                    cls: 'mybutton',
                                    handler: function(){
                                        var thread_record = CL.app.getController("C_collection_thread_message").thread_record,
                                            collection_id = thread_record.get("collection_id");


                                        CL.app.getController("C_permessi").canWriteCollectionThread(collection_id, true,function(){
                                            Ext.Msg.confirm('Attenzione!', 'Eliminare definitivamente la discussione <b>"'+thread_record.get("title")+"\"</b>?",function(btn){
                                                if (btn === 'yes') {
                                                    Ext.StoreManager.lookup("S_collection_thread").load({
                                                        params: {
                                                            collection_id: collection_id
                                                        },
                                                        callback: function () {
                                                            this.remove(this.getById(thread_record.get("id")));
                                                            this.sync({
                                                                callback: function () {
                                                                    CL.app.getController("C_collection").redirectTo("collection/" + collection_id+"/threads");
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        });


                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'button',
                                    tooltip: "Modifica Info",
                                    iconCls: 'x-fa fa-lock',
                                    action: 'on_edit_info',
                                    cls: 'mybutton',
                                    handler: function(){
                                        var thread_record = CL.app.getController("C_collection_thread_message").thread_record,
                                            collection_id = thread_record.get("collection_id");


                                        CL.app.getController("C_permessi").canWriteCollectionThread(collection_id, true,function(){
                                            if(thread_record.get("closed_at")!=null)
                                                Ext.Msg.alert("Attenzione!","Questa discussione è già stata chiusa!");
                                            else{
                                                Ext.Msg.confirm('Attenzione!', 'Chiudere la discussione <b>"'+thread_record.get("title")+"\"</b>?<br><br>Non sarà più possibile rispondere con ulteriori messaggi ma rimarrà comunque consultabile!",function(btn){
                                                    if (btn === 'yes'){
                                                        Ext.Msg.prompt("Chiusura Discussione","Giustifica il motivo della chiusura:", function(btn, text){
                                                            if (btn == 'ok'){
                                                                Ext.StoreManager.lookup("S_collection_thread").load({
                                                                    params:{
                                                                        collection_id: collection_id
                                                                    },
                                                                    callback: function () {
                                                                        this.getById(thread_record.get("id")).set({
                                                                            closed_by: Ext.util.Cookies.get("user_id"),
                                                                            close_message: text
                                                                        });
                                                                        Ext.StoreManager.lookup("S_collection_thread").sync({
                                                                            callback: function () {
                                                                                location.reload(true);
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            ]
                        }

                    ]
                },
                {
                    xtype: 'label',
                    text:'collezione',
                    name: 'collection',
                    style: {
                        color: 'white',
                        fontSize: 'medium'
                    },
                    margin: '0 0 0 0'
                },
                {
                    xtype: 'label',
                    text: 'created_by_name',
                    name: 'created_by_name',
                    style: {
                        color: '#963232',
                        fontSize: 'medium',
                        fontWeight: 'bold'
                    },
                    margin: '20 0 0 0'
                },
                {
                    xtype: 'label',
                    text: 'data_chiusura',
                    name: 'data_chiusura',
                    //html: 'Data di chiusura delle modifiche: <u>24-06-2016 16:00</u>',
                    style: {
                        color: 'white',
                        fontSize: 'medium'
                    },
                    margin: '20 0 0 0'
                },
                {html:'<br>'}
            ]
        },

        {
            xtype: 'panel',
            height: 700,
            width: '100%',
            margin: '10 0 10 0',
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'center'
            },
            bodyStyle: {
                background: "#333333"
            },
            items:[
                {
                    xtype: 'panel',
                    padding: 10,
                    flex: 1,
                    bodyStyle: {
                        background: 'url(images/no_preview.jpg)',
                        backgroundSize: 'cover'
                    },
                    height: '100%',
                    layout: 'fit',
                    name: 'preview'/*,
                 listeners:{
                 render: function (panel) {
                 panel.el.on('mouseenter', function () {
                 console.log("mouseenter per evitare lo scrolling del corpo principale mentre scrollo sull'imageviewer");
                 Ext.ComponentQuery.query("viewport panel[name=scrollable]")[0].setOverflowXY(false,false);
                 });
                 panel.el.on('mouseleave', function () {
                 console.log("mouseleave per evitare lo scrolling del corpo principale mentre scrollo sull'imageviewer");
                 Ext.ComponentQuery.query("viewport panel[name=scrollable]")[0].setOverflowXY(false,"scroll");
                 });
                 }
                 }*/
                }
            ]
        }
    ]

});
