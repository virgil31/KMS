Ext.define('CL.view.event.V_single_list', {
    extend: 'Ext.panel.Panel',
    xtype: 'event_single_list',
    itemId: 'event_single_list_id',
    alias: 'widget.event_single_list',

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
            //bodyCls: 'mypanel',
            bodyStyle:{
                background: "url(images/profile_repeat.png)",
                borderRadius: "10px",
                border: "1px black solid !important"
            },
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
                                    tooltip: 'Condividi Evento',
                                    icon: 'images/icons/icon_share.png',
                                    cls: 'mybutton',
                                    action: 'share_event'
                                }
                            ]
                        },
                        '->',
                        {
                            xtype: 'panel',
                            bodyStyle: {
                                background: "transparent"
                            },
                            layout: {
                                type: 'hbox',
                                align:'center',
                                pack: 'center'
                            },
                            items:[
                                {
                                    xtype: 'label',
                                    style: {
                                        background: "transparent"
                                    },
                                    html: '<img tooltip="Evento" src="images/icons/icon_calendar_hd.png" alt=" " style="width:50px;height:50px;">'
                                },
                                {
                                    xtype: 'label',
                                    name: 'title',
                                    margin: '0 0 0 10',
                                    style: {
                                        color: 'white',
                                        fontSize: 'xx-large',
                                        fontWeight: 'bold'
                                    }
                                }
                            ]
                        },

                        '->',
                        {
                            xtype: 'panel',
                            items: [
                                {
                                    xtype: 'button',
                                    tooltip: 'Elimina Evento',
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
                            xtype: 'event_file_list_by_event'
                        },
                        {
                            xtype: 'event_external_resource_list_by_event'
                        },
                        {
                            xtype: 'event_user_list_by_event'
                        },
                        {
                            xtype: 'event_thread_list_by_event'
                        },
                        {
                            xtype: 'event_tag_list_by_event'
                        }
                    ]
                }
            ]
        }
    ]

});
