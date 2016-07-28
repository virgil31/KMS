Ext.define('CL.view.collection_tag.V_list_by_collection', {
    extend: 'Ext.panel.Panel',
    xtype: 'collection_tag_list_by_collection',
    itemId: 'collection_tag_list_by_collection_id',
    alias: 'widget.collection_tag_list_by_collection',

    title: 'TAGs',
    icon: 'images/icons/icon_tag.png',
    bodyStyle: 'background: #484848',
    padding: 1,


    listeners: {
        activate: function(){
            Ext.StoreManager.lookup("S_collection_tag").load({
                params:{
                    collection_id: (window.location.hash.split("/"))[1]
                }
            });

            var collection_id = (window.location.hash.split("/"))[1];
            CL.app.getController("C_collection").redirectTo("collection/"+collection_id+"/tags");
        }
    },


    layout: 'fit',
    

    items: [
        {
            xtype: 'grid',
            name:'collection_tag',
            store: 'S_collection_tag',
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
                                var collection_id = (window.location.hash.split("/"))[1];

                                CL.app.getController("C_permessi").canWriteCollection(collection_id, true,function(){
                                    var rec = grid.getStore().getAt(rowIndex);

                                    Ext.Msg.confirm('Attenzione!', 'Eliminare il tag <b>'+rec.get("to_display")+"</b>?",function(btn){
                                        if (btn === 'yes'){
                                            Ext.StoreManager.lookup("S_collection_tag").remove(rec);
                                            Ext.StoreManager.lookup("S_collection_tag").sync();
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
