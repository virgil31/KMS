Ext.define('CL.view.collection_file.V_single_list', {
    extend: 'Ext.panel.Panel',
    xtype: 'collection_file_single_list',
    itemId: 'collection_file_single_list_id',
    alias: 'widget.collection_file_single_list',

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
                                    tooltip: 'Scarica Documento',
                                    iconCls: 'x-fa fa-download',
                                    cls: 'mybutton',
                                    handler: function () {
                                        var rec = Ext.StoreManager.lookup("S_collection_file").getAt(0);

                                        Ext.create('Ext.Component', {
                                            renderTo: Ext.getBody(),
                                            cls: 'x-hidden',
                                            autoEl: {
                                                tag: 'iframe',
                                                src: 'data/collection_file/download_single.php?file_id='+rec.get("file_id")+'&collection_id='+rec.get("collection_id")
                                            }
                                        });
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            items: [
                                {
                                    xtype: 'button',
                                    tooltip: 'Condividi Collezione',
                                    icon: 'images/icons/icon_share.png',
                                    cls: 'mybutton',
                                    handler: function () {
                                        var rec = Ext.StoreManager.lookup("S_collection_file").getAt(0);

                                        CL.app.getController("C_collection_file").share(this.el,rec);
                                    }
                                }
                            ]
                        },
                        '->',
                        {
                            xtype: 'label',
                            text:'title',
                            name: 'title',
                            style: {
                                color: 'white',
                                fontSize: 'xx-large',
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
                                        var rec = Ext.StoreManager.lookup("S_collection_file").getAt(0),
                                            collection_id = rec.get("collection_id");

                                        CL.app.getController("C_permessi").canWriteCollection(collection_id, true,function(){
                                            Ext.Msg.confirm('Attenzione!', 'Eliminare <b>'+rec.get("title")+"</b>?",function(btn){
                                                if (btn === 'yes')
                                                    Ext.StoreManager.lookup("S_collection_file").remove(rec);
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
                                    iconCls: 'x-fa fa-pencil',
                                    action: 'on_edit_info',
                                    cls: 'mybutton',
                                    handler: function(){
                                        var rec = Ext.StoreManager.lookup("S_collection_file").getAt(0),
                                            collection_id = rec.get("collection_id");

                                        CL.app.getController("C_permessi").canWriteCollection(collection_id, true,function(){
                                            CL.app.getController("C_collection_file").onEdit(rec);
                                        });
                                    }
                                }
                            ]
                        }

                    ]
                },
                {
                    xtype: 'label',
                    text:'description',
                    name: 'description',
                    style: {
                        color: 'white',
                        fontSize: 'medium'
                    },
                    margin: '20 0 0 0'
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
                background: "transparent"
            },
            items:[
                {
                    xtype: 'tabpanel',
                    flex: 1,
                    bodyStyle: 'background: #333333',
                    height: '100%',
                    items: [
                    ]
                }
            ]
        }
    ]

});
