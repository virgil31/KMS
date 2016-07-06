Ext.define('CL.view.bbar.V_bbar', {
	extend: 'Ext.toolbar.Toolbar',
    xtype: 'bbar',
    itemId: 'bbar_id',
    alias: 'widget.bbar',


    width: '100%',
    height: 264,	//88
	/*style: 'background: #333333;' +
			'border-top-width: 1px !important;' +
			'border-top-color: #000000;',*/

	cls: 'mybar',

	layout: {
		type: 'vbox',
		align: 'center'
	},

	items: [
		{
			xtype: 'panel',
			width: 960,
			height: 264,
            bodyStyle: {
                background: "transparent"
            },
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'center'
            },
            defaults: {
                flex: 1,
                height: '100%',
                margin: "25 0 0 0",
                bodyStyle: {
                    background: "transparent"
                },
                layout:{
                    type: 'vbox'
                }
            },
			items: [
				/*{
					xtype: 'button',
					text: 'Go Top',
					handler: function(){			
						Ext.ComponentQuery.query('viewport panel')[0].body.scrollTo('top',0);
					}
				}*/

                // LINK UTILI
                {
                    xtype: 'panel',
                    items: [
                        {
                            xtype: 'label',
                            style: {
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 30
                            },
                            text: 'Links Utili'
                        },
                        {
                            xtype: 'label',
                            margin: "5 0 0 0",
                            style: {
                                color: "white"
                            },
                            html: '<li>Prova prova prova prova</li>' +
                                '<li>Prova prova prova prova</li>' +
                                '<li>Prova prova prova prova</li>' +
                                '<li>Prova prova prova prova</li>' +
                                '<li>Prova prova prova prova</li>'+
                                '<li>Prova prova prova prova</li>'
                        },
                        {
                            xtype: 'panel',
                            margin: "30 0 0 0",
                            layout:{
                                type: 'hbox'
                            },
                            bodyStyle:{
                                background: "transparent"
                            },
                            items: [
                                {
                                    xtype: 'image',
                                    src: 'images/icons/icon_info.png',
                                    width: 60,
                                    height: 60,
                                    alt: " ",
                                    margin: "0 5 0 0"
                                },
                                {
                                    xtype: 'image',
                                    src: 'images/icons/icon_info.png',
                                    width: 60,
                                    height: 60,
                                    alt: " ",
                                    margin: "0 5 0 0"
                                },
                                {
                                    xtype: 'image',
                                    src: 'images/icons/icon_info.png',
                                    width: 60,
                                    height: 60,
                                    alt: " ",
                                    margin: "0 5 0 0"
                                }
                            ]
                        }
                    ]
                },

                // AAAAAAAAAAAAAAAAAAA
                {
                    xtype: 'panel',
                    items: [
                        {
                            xtype: 'label',
                            style: {
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 30
                            },
                            text: 'AAAAA'
                        }
                    ]
                },

                // CONTATTACI
                {
                    xtype: 'panel',
                    items: [
                        {
                            xtype: 'label',
                            style: {
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 30
                            },
                            text: 'Contattaci'
                        }
                    ]
                }
			]
		}
	]


});