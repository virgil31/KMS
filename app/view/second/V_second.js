Ext.define('CL.view.second.V_second', {
    extend: 'Ext.panel.Panel',
    xtype: 'second',
    itemId: 'second_id',
    alias: 'widget.second',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    items: [        
        {
            xtype: 'textfield',
            name: 'param1',
            fieldLabel: 'param1',
            readOnly: true
        },
        {
            xtype: 'textfield',
            name: 'param2',
            fieldLabel: 'param2',
            readOnly: true
        },
        {
            xtype: 'panel',
            title: 'asd',
            border: true,
            width: 500,
            height: 200
        },
        {
            xtype: 'panel',
            title: 'asd',
            border: true,
            width: 500,
            height: 200
        },
        {
            xtype: 'panel',
            title: 'asd',
            border: true,
            width: 500,
            height: 200
        },
        {
            xtype: 'panel',
            title: 'asd',
            border: true,
            width: 500,
            height: 200
        },
        {
            xtype: 'panel',
            title: 'asd',
            border: true,
            width: 500,
            height: 200
        }
    ]

});
