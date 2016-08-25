Ext.define('CL.view.event_tag.V_list_by_event', {
    extend: 'Ext.panel.Panel',
    xtype: 'event_tag_list_by_event',
    itemId: 'event_tag_list_by_event_id',
    alias: 'widget.event_tag_list_by_event',

    title: 'TAGs',
    icon: 'images/icons/icon_tag.png',
    bodyStyle: 'background: #484848',
    padding: 1,


    listeners: {
        activate: function(){
            Ext.StoreManager.lookup("S_event_tag").load({
                params:{
                    event_id: (window.location.hash.split("/"))[1]
                }
            });

            var event_id = (window.location.hash.split("/"))[1];
            CL.app.getController("C_event").redirectTo("event/"+event_id+"/tags");
        }
    },


    layout: 'fit',
    

    items: [
        {
            xtype: 'grid',
            name:'event_tag',
            store: 'S_event_tag',
            hideHeaders: true,
            cls: 'myRowClass',
            tbar: [
                {
                    xtype: 'panel',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Aggiungi TAG',
                            iconCls: 'x-fa fa-plus',
                            action: 'on_create'
                        }
                    ]
                }
            ],
            columns: [
                { 
                    dataIndex: 'tooltip',
                    flex: 1,
                    renderer: function (value, metaData, record) {
                        metaData.tdStyle = 'background: #d3d3d3;';
                        return value;
                    }
                },
                {
                    xtype: 'actioncolumn',
                    width: 50,
                    renderer: function (value, metaData, record) {
                        metaData.tdStyle = 'background: #d3d3d3;';
                        return value;
                    },
                    items: [
                        {
                            iconCls: 'x-fa fa-trash',
                            tooltip: 'Elimina',
                            handler: function(grid, rowIndex) {
                                var event_id = (window.location.hash.split("/"))[1];

                                CL.app.getController("C_permessi").canWriteEvent(event_id, true,function(){
                                    var rec = grid.getStore().getAt(rowIndex);

                                    Ext.Msg.confirm('Attenzione!', 'Eliminare il tag <b>'+rec.get("to_display")+"</b>?",function(btn){
                                        if (btn === 'yes'){
                                            Ext.StoreManager.lookup("S_event_tag").remove(rec);
                                            Ext.StoreManager.lookup("S_event_tag").sync();

                                            Ext.toast({
                                                title: 'Successo',
                                                html: 'TAG rimosso correttamente!',
                                                align: 'br'
                                            });
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
