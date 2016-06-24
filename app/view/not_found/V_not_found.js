Ext.define('CL.view.not_found.V_not_found', {
    extend: 'Ext.panel.Panel',
    xtype: 'not_found',
    itemId: 'not_found_id',
    alias: 'widget.not_found',

    bodyStyle: 'backgroundColor: transparent',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    items: [        
        {
            xtype: 'image',
            src: 'images/404_augusto.png',//'http://austinvisuals.com/wp-content/uploads/austin-visuals-blog-404-omg-not-found.png',
            alt: ' ',
            width: 360,
            height: 420,
            margin: '40 0 0 0'
        },
        {
            xtype: 'button',
            text: 'Torna alla Home Page!',
            action: 'go_to_home',
            margin: '20 0 40 0',
            style: 'backgroundColor: #333333'
        }
    ]

});
