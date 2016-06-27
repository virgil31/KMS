Ext.define('CL.view.collection.V_single_list', {
    extend: 'Ext.panel.Panel',
    xtype: 'collection_single_list',
    itemId: 'collection_single_list_id',
    alias: 'widget.collection_single_list',

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
            //height: 175,
            width: '100%',
            margin: '10 0 0 0',
            bodyCls: 'mypanel',
            //bodyStyle: 'backgroundColor: #333333',
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
                                    tooltip: 'Elimina Collection',
                                    iconCls: 'x-fa fa-trash',
                                    action: 'on_destroy'
                                }
                            ]
                        },

                        '->',
                        {
                            xtype: 'label',
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
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'button',
                                    tooltip: "Modifica Info",
                                    iconCls: 'x-fa fa-pencil',
                                    action: 'on_edit_info'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'label',
                    name: 'title',
                    style: {
                        color: 'white',
                        fontSize: 'xx-large',
                        fontWeight: 'bold'
                    }
                },
                {
                    xtype: 'label',
                    name: 'description',
                    style: {
                        color: 'white',
                        fontSize: 'medium'
                    },
                    margin: '20 0 0 0'
                },
                {
                    xtype: 'label',
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
                        {
                            xtype: 'collection_file_list_by_collection'
                        },
                        {
                            title: 'Links',
                            icon: 'images/icons/icon_link.png',
                            bodyStyle: 'background: #484848',
                            layout: {
                                type: 'vbox',
                                align: 'center',
                                pack: 'center'
                            },
                            padding: 1,
                            items: []
                        },
                        {
                            title: 'Discussioni',
                            icon: 'images/icons/icon_msg.png',
                            bodyStyle: 'background: #484848',
                            layout: {
                                type: 'vbox',
                                align: 'center',
                                pack: 'center'
                            },
                            padding: 1,
                            items: []
                        },
                        {
                            title: 'Collaboratori',
                            icon: 'images/icons/icon_collaboratori.png',
                            bodyStyle: 'background: #484848',
                            layout: {
                                type: 'vbox',
                                align: 'center',
                                pack: 'center'
                            },
                            padding: 1,
                            items: []
                        },
                        {
                            title: 'TAGs',
                            bodyStyle: 'background: #484848',
                            layout: {
                                type: 'vbox',
                                align: 'center',
                                pack: 'center'
                            },
                            padding: 1,
                            items: []
                        }/*,
                        {
                            title: 'Collezioni Correlate',
                            bodyStyle: 'background: #484848',
                            layout: {
                                type: 'vbox',
                                align: 'center',
                                pack: 'center'
                            },
                            padding: 1,
                            items: []
                        },
                        {
                            title: 'Eventi Correlati',
                            bodyStyle: 'background: #484848',
                            layout: {
                                type: 'vbox',
                                align: 'center',
                                pack: 'center'
                            },
                            padding: 1,
                            items: []
                        },
                        {
                            title: 'Origini Informazione Correlate',
                            bodyStyle: 'background: #484848',
                            layout: {
                                type: 'vbox',
                                align: 'center',
                                pack: 'center'
                            },
                            padding: 1,
                            items: []
                        },
                        {
                            title: 'Partizioni Archeologiche Correlate',
                            bodyStyle: 'background: #484848',
                            layout: {
                                type: 'vbox',
                                align: 'center',
                                pack: 'center'
                            },
                            padding: 1,
                            items: []
                        }*/
                    ]
                }
            ]
        }
    ]

});
