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
                                        var colletion_id = CL.app.getController("C_collection_file").collection_id;
                                        var file_id = CL.app.getController("C_collection_file").file_id;

                                        Ext.create('Ext.Component', {
                                            renderTo: Ext.getBody(),
                                            cls: 'x-hidden',
                                            autoEl: {
                                                tag: 'iframe',
                                                src: 'data/collection_file/download_single.php?file_id='+file_id+'&collection_id='+colletion_id
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
                                        var targetEl = this,
                                            collection_id = CL.app.getController("C_collection_file").collection_id,
                                            file_id = CL.app.getController("C_collection_file").file_id,
                                            store = Ext.create("CL.store.S_collection_file");

                                        store.load({
                                            params:{
                                                collection_id: collection_id,
                                                file_id: file_id
                                            },
                                            callback: function () {
                                                var rec = this.getAt(0);
                                                CL.app.getController("C_collection_file").share(targetEl,rec);

                                            }
                                        });
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
                            html: '<img src="http://sharpened.com/img/sw/fvl.png" alt=" " style="width:50px;height:50px;margin-left: -10px; margin-top: 10px;">'
                        },
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

                                        var collection_id = CL.app.getController("C_collection_file").collection_id,
                                            file_id = CL.app.getController("C_collection_file").file_id,
                                            store = Ext.create("CL.store.S_collection_file");

                                        store.load({
                                            params:{
                                                collection_id: collection_id,
                                                file_id: file_id
                                            },
                                            callback: function () {
                                                var rec = this.getAt(0);
                                                CL.app.getController("C_permessi").canWriteCollection(collection_id, true,function(){
                                                    Ext.Msg.confirm('Attenzione!', 'Eliminare <b>'+rec.get("title")+"</b>?",function(btn){
                                                        if (btn === 'yes')
                                                            Ext.StoreManager.lookup("S_collection_file").remove(rec);
                                                    });
                                                });

                                            }
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

                                        var collection_id = CL.app.getController("C_collection_file").collection_id,
                                            file_id = CL.app.getController("C_collection_file").file_id,
                                            store = Ext.create("CL.store.S_collection_file");

                                        store.load({
                                            params:{
                                                collection_id: collection_id,
                                                file_id: file_id
                                            },
                                            callback: function () {
                                                var rec = this.getAt(0);
                                                CL.app.getController("C_permessi").canWriteCollection(collection_id, true,function(){
                                                    CL.app.getController("C_collection_file").onEdit(rec);
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
                background: "#333333"
            },
            items:[
                {
                    xtype: 'panel',
                    padding: 10,
                    flex: 1,
                    bodyStyle: {
                        background: 'url(http://www.mymart.sg/adminUpload/big2/1429100288no-preview-available.jpg)',
                        backgroundSize: 'cover'
                    },
                    height: '100%',
                    layout: 'fit',
                    name: 'preview',
                    listeners:{
                        render: function (panel) {
                            panel.el.on('mouseenter', function () {
                                // alert("TODO MOUSE ENTER PER EVITARE SCROLLING")
                                console.log("mouseenter");
                                Ext.ComponentQuery.query("viewport panel[name=scrollable]")[0].setOverflowXY(false,false);
                            });
                            panel.el.on('mouseleave', function () {
                                //alert("TODO MOUSE LEAVE PER EVITARE SCROLLING")
                                console.log("mouseleave");
                                Ext.ComponentQuery.query("viewport panel[name=scrollable]")[0].setOverflowXY(false,"scroll");

                            });
                        }
                    }
                }
            ]
        }
    ]

});
