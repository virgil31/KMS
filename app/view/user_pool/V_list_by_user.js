Ext.define('CL.view.user_pool.V_list_by_user', {
    extend: 'Ext.window.Window',
    xtype: 'user_pool_list_by_user',
    itemId: 'user_pool_list_by_user_id',
    alias: 'widget.user_pool_list_by_user',

    bodyStyle: {
        background: "transparent"
    },

    autoShow: true,
    modal: true,
    constrain: true,
    resizable: false,

    title: 'Lista dei miei Gruppi',

    width: 500,

    items: [
        {
            xtype: 'grid',
            border: true,
            store: 'S_user_pool',
            height: 300,
            padding: 10,
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
                            tooltip: 'Guarda/Modifica Info Gruppo',
                            handler: function (grid, rowIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                CL.app.getController("C_user_pool").onEdit(rec,this.el);
                            }
                        },
                        {
                            iconCls: 'x-fa fa-trash',
                            tooltip: 'Elimina Gruppo',
                            handler: function (grid, rowIndex) {
                                var rec = grid.getStore().getAt(rowIndex);

                                CL.app.getController("C_user_pool").onDestroy(rec);
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
    ],
    buttonAlign: 'center',
    buttons: [
        {
            text: 'Crea Nuovo Gruppo',
            handler: function(){ CL.app.getController("C_user_pool").onCreate(this.el); }
        }
    ]

});