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
			bodyStyle: 'background: transparent', // cambiare colore per vedere spazio disponibile nella bbar
			items: [
				/*{
					xtype: 'button',
					text: 'Go Top',
					handler: function(){			
						Ext.ComponentQuery.query('viewport panel')[0].body.scrollTo('top',0);
					}
				}*/
			]
		}
	]


});