Ext.define('CL.view.user.V_profile', {
    extend: 'Ext.panel.Panel',
    xtype: 'user_profile',
    itemId: 'user_profile_id',
    alias: 'widget.user_profile',

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
            height: 150,
            width: '100%',
            margin: '10 0 0 0',
            bodyStyle: 'backgroundColor: #333333',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'label',
                    name: 'first_last_name',
                    style: {
                        color: 'white',
                        fontSize: 'xx-large',
                        fontWeight: 'bold'
                    }
                },
                {
                    xtype: 'label',
                    name: 'group_name',
                    style: {
                        color: 'white',
                        fontSize: 'medium'
                    },
                    margin: '20 0 0 0'
                },
                {
                    xtype: 'label',
                    name: 'email_address',
                    style: {
                        color: '#963232',
                        fontSize: 'medium',
                        fontWeight: 'bold'
                    },
                    margin: '20 0 0 0'
                }
            ]
        },

        {
            xtype: 'panel',
            height: 500,
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
                    xtype: 'grid',
                    name: 'collections',
                    flex: 1,
                    height: '100%',
                    bodyStyle: {
                        background: "#484848"
                    },
                    margin: '0 5 0 0',
                    tbar: {
                        xtype: 'toolbar',
                        height: 44,
                        style: 'background: #333333',
                        items: [
                            {
                                xtype: 'label',
                                text: 'Collezioni',
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
                                        name: 'on_create_collection',
                                        text: '+ Carica una nuova Collezione',
                                        icon: 'images/icons/icon_box.png',
                                        hidden: true,
                                        listeners:{
                                            click: function (btn) {
                                                CL.app.getController("C_collection").onCreate(btn.el);
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    store: Ext.create('CL.store.S_collection'),
                    listeners: {
                        itemclick: function (grid, record) {
                            var id = record.get("id");
                            CL.app.getController("C_collection").redirectTo("collection/"+id);
                        }
                    },
                    columns: [
                        { text: 'Titolo', dataIndex: 'title', flex: 10 },
                        { xtype: 'datecolumn', text: 'Creata Il', dataIndex: 'created_at', format:'d/m/Y', flex: 3.5 }
                    ]
                },
                {
                    xtype: 'panel',
                    flex: 1,
                    height: '100%',
                    bodyStyle: {
                        background: "#484848"
                    },
                    margin: '0 0 0 5',
                    tbar: {
                        xtype: 'toolbar',
                        height: 44,
                        style: 'background: #333333',
                        items: [
                            {
                                xtype: 'label',
                                text: 'Eventi',
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
                                        name: 'on_create_event',
                                        text: '+ Crea un nuovo Evento !',
                                        icon: 'images/icons/icon_calendar.png',
                                        hidden: true
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    ]

});
