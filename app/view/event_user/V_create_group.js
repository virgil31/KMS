Ext.define('CL.view.event_user.V_create_group', {
    extend: 'Ext.window.Window',
    xtype: 'event_user_create_group',
    itemId: 'event_user_create_group_id',
    alias: 'widget.event_user_create_group',

    bodyStyle: {
        background: "transparent"
    },


    autoShow: true,
    modal: true,
    constrain: true,
    resizable: false,

    buttonAlign: 'center',

    title: 'Aggiungi Gruppo di Collaboratori',

    width: 500,
    padding: 15,

    items: [
        {
            xtype: 'label',
            html: '<div style="text-align: center">I collaboratori potranno aiutarti a compilare<br>la scheda dell\'Evento e a <b>caricare nuovi documenti!</b></div><br>'
        },
        {
            layout: "hbox",
            width: "100%",
            items:[
                {
                    xtype: 'textfield',
                    name: 'query',
                    emptyText: 'Cerca gruppo da aggiungere (puoi usare anche il suo ID)',
                    flex: 90,
                    listeners: {
                        specialkey: function(me,e){
                            if (e.getKey() === e.ENTER){
                                Ext.ComponentQuery.query('event_user_create_group button[action=do_query]')[0].fireEvent("click");
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    action: 'do_query',
                    iconCls: 'x-fa fa-search',
                    flex: 10,
                    listeners:{
                        click: function () {
                            var store = Ext.StoreManager.lookup("S_user_pool"),
                                query = Ext.ComponentQuery.query("event_user_create_group textfield[name=query]")[0].getValue();

                            store.proxy.extraParams.query = query.trim();
                            Ext.StoreManager.lookup("S_user_pool").loadPage(1);
                        }
                    }
                }
            ]
        },
        {
            xtype: 'grid',
            border: true,
            store: 'S_user_pool',
            height: 300,
            hideHeaders: true,
            margin: '10 0 0 0',
            columns: [
                {
                    dataIndex: 'pool_name',
                    flex: 1,
                    renderer: function (value, metaData, record) {
                        return value+" (#"+record.get("pool_id")+")";
                    }
                },
                {
                    xtype: 'actioncolumn',
                    width: 60,
                    items: [
                        {
                            iconCls: 'x-fa fa-search',
                            tooltip: 'Guarda dettagli Gruppo',
                            handler: function (grid, rowIndex) {
                                var rec = grid.getStore().getAt(rowIndex),
                                    pool_id = rec.get("pool_id"),
                                    pool_name = rec.get("pool_name");

                                Ext.create("Ext.window.Window",{
                                    animateTarget: this.el,
                                    title: 'Lista utenti',
                                    autoShow: true,
                                    modal: true,
                                    constrain: true,
                                    height: 400,
                                    width: 350,
                                    layout: 'fit',
                                    items:[
                                        {
                                            xtype: 'grid',
                                            border: true,
                                            store: 'S_user',
                                            hideHeaders: true,
                                            tbar: {
                                                xtype: "toolbar",
                                                style: {
                                                    background: "#c2c2c2"
                                                },
                                                items:[
                                                    {
                                                        xtype: 'label',
                                                        html: "Creato da: <b>"+rec.get("created_by_name")+"</b>"
                                                    }
                                                ]
                                            },
                                            columns: [
                                                {
                                                    dataIndex: 'user_name',
                                                    flex: 1,
                                                    renderer: function (value, metaData, record) {
                                                        return record.get("last_name")+" "+record.get("first_name")+" (#"+record.get("id")+")";
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                });


                                Ext.StoreManager.lookup("S_user").load({
                                    params: {
                                        pool_id: pool_id
                                    }
                                });

                            }
                        },
                        {
                            iconCls: 'x-fa fa-plus',
                            tooltip: 'Aggiungi questo Gruppo ai Collaboratori',
                            handler: function (grid, rowIndex) {
                                var rec = grid.getStore().getAt(rowIndex),
                                    pool_id = rec.get("pool_id"),
                                    pool_name = rec.get("pool_name");

                                Ext.Msg.confirm("Info","Sicuro di voler aggiungere tutti gli utenti nel gruppo:<br> <b>"+pool_name+"</b>?",function (btnId) {
                                    if(btnId == "yes"){
                                        CL.app.getController("C_event_user").doCreateGroup(pool_id);
                                        Ext.ComponentQuery.query("event_user_create_group")[0].close();
                                    }
                                });
                            }
                        }
                    ]
                }
            ],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: 'S_user_pool',
                dock: 'bottom'
            }]
        }
    ]

});
