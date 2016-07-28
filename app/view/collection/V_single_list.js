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
                                    tooltip: 'Mostra Licenza Utilizzata',
                                    icon: 'images/icons/icon_license.png',
                                    cls: 'mybutton',
                                    action: 'show_license_info'
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
                                    action: 'share_collection'
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
                            items: [
                                {
                                    xtype: 'button',
                                    tooltip: 'Elimina Collection',
                                    iconCls: 'x-fa fa-trash',
                                    action: 'on_destroy',
                                    cls: 'mybutton'
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
                                    cls: 'mybutton'
                                }
                            ]
                        }

                    ]
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
                            xtype: 'collection_external_resource_list_by_collection'
                        },
                        {
                            xtype: 'collection_user_list_by_collection'
                        },
                        {
                            xtype: 'collection_thread_list_by_collection'
                        },
                        {
                            xtype: 'collection_tag_list_by_collection'
                        }/*,
                        {
                            title: 'TAGs',
                            icon: 'images/icons/icon_tag.png',
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
