Ext.define('CL.view.tbar.V_tbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'tbar',
    itemId: 'tbar_id',
    alias: 'widget.tbar',

    height: 88,
	/*style: 'background: #333333;' +
    		'border-bottom-width: 1px !important;' +
    		'border-bottom-color: #000000;',*/
    cls: 'mybar',

	initComponent: function() {
		var this_view = this;

		var user_id = Ext.util.Cookies.get("user_id");

		if(user_id == null){
            this_view.items = [
				'->',
				{
					xtype: 'toolbar',
					width: 1000,
					style: "background: transparent; border:none;margin-left: -15px !important;",
					items:[
						{
							xtype: 'button',
							name: 'app_icon',
							width: 46,
							height: 46,
							style: "background-image: url('images/logos/icon_app_large_red.png') !important; " +
								"background-size: 100% 100%;" +
								"border-color: transparent;" +
								"background-color: transparent",
							handler: function () {
								window.location.href = window.location.pathname + "#home";
								location.reload();
							}
						},
						{
							xtype: 'button',
							width: 200,
							height: 53,
							margin: '0 0 0 10',
							style: "background-image: url('images/logos/logo_sitar.png') !important; " +
								"background-size: 100% 100%;" +
								"border-color: transparent;" +
								"background-color: transparent",
							handler: function () {
								window.open("http://www.archeositarproject.it/",'_blank');
							},
							listeners: {
								mouseover: function(){
									this.getEl().setStyle("background-image","url(images/logos/logo_sitar_red2.png)");
								},
								mouseout: function(){
									this.getEl().setStyle("background-image","url(images/logos/logo_sitar.png)");
								}
							}
						},
						'->',
						{
							xtype: 'panel',
							bodyStyle: 'background: transparent',
							padding: '8 0 0 0 ',
							layout: {
								type: 'vbox'
							},
							items: [
								{
									xtype: 'panel',
									bodyStyle: 'background: transparent',
									layout: {
										type: 'hbox'
									},
									items: [
										{
											xtype: 'textfield',
											name: 'username',
											emptyText: 'Username',
											listeners: {
												specialkey: function(me,e){
													if (e.getKey() === e.ENTER)
														Ext.ComponentQuery.query('tbar button[action=do_login]')[0].fireEvent("click");
												}
											}
										},
										{
											xtype: 'textfield',
											name: 'password',
											emptyText: 'Password',
											inputType: 'password',
											margin: '0 5 0 5',
											listeners: {
												specialkey: function(me,e){
													if (e.getKey() === e.ENTER)
														Ext.ComponentQuery.query('tbar button[action=do_login]')[0].fireEvent("click");
												}
											}
										},
										{
											xtype: 'button',
											action: 'do_login',
											text: '>'
										}
									]
								},
								{
									xtype: 'panel',
                                    bodyStyle: {
                                        background: "transparent"
                                    },
                                    layout: 'hbox',
                                    margin: '5 0 0 0',
                                    items: [
                                        {
                                            xtype: 'component',
                                            autoEl: {
                                                tag: 'a',
                                                href: '#sign_up',
                                                html: 'Registrati!'
                                            }
                                        },
                                        {
                                            xtype: 'label',
                                            margin: '0 0 0 120',
                                            html: '<a href="#" onclick="CL.app.getController(\'C_sign_up\').onLostPassword(this);return false;">Password dimenticata</a>'
                                        }/*,
                                        {
                                            xtype: 'component',
                                            margin: '0 0 0 120',
                                            autoEl: {
                                                tag: 'a',
                                                href: "#on_lost_password",
                                                html: 'Password dimenticata'
                                            }
                                        }*/
                                    ]
								}
							]
						}
					]
				},
				'->'
			];
        }  
        else{
            this_view.items = [
				'->',
				{
					xtype: 'toolbar',
					width: 1000,
					style: "background: transparent; border:none; margin-left: -15px !important;",
					items:[
						{
							xtype: 'button',
							name: 'app_icon',
							width: 46,
							height: 46,
							style: "background-image: url('images/logos/icon_app_large_red.png') !important; " +
								"background-size: 100% 100%;" +
								"border-color: transparent;" +
								"background-color: transparent",
							handler: function () {
								window.location.href = window.location.pathname + "#home";
								location.reload();
							}/*,
							listeners: {
								mouseover: function(){
									this.getEl().setStyle("background-image","url(images/logos/icon_app_large_red.png)");
								},
								mouseout: function(){
									this.getEl().setStyle("background-image","url(images/logos/icon_app_large.png)");
								}
							}*/
						},
						{
							xtype: 'button',
							width: 200,
							height: 53,
							margin: '0 0 0 10',
							style: "background-image: url('images/logos/logo_sitar.png') !important; " +
								"background-size: 100% 100%;" +
								"border-color: transparent;" +
								"background-color: transparent",
							handler: function () {
								window.open("http://www.archeositarproject.it/",'_blank');
							},
							listeners: {
								mouseover: function(){
									this.getEl().setStyle("background-image","url(images/logos/logo_sitar_red3.png)");
								},
								mouseout: function(){
									this.getEl().setStyle("background-image","url(images/logos/logo_sitar.png)");
								}
							}
						},
						'->',
						{
							xtype: 'panel',
							items: [
								{
									xtype: 'button',
                                    cls: 'mybutton',
                                    text: Ext.util.Cookies.get("username"),
                                    menu: [
										{
											text: 'Mio Profilo',
											icon: "images/icons/icon_profile.png",
                                            handler: function(){
                                                var my_id = Ext.util.Cookies.get("user_id");
                                                CL.app.getController("C_tbar").redirectTo('user/'+my_id);
                                            }
										},
                                        {
                                            text: 'Reset Password',
                                            icon: "images/icons/icon_lock.png",
                                            handler: function(){
                                                CL.app.getController("C_tbar").redirectTo('on_lost_password');
                                            }
                                        },
                                        
                                        
                                        
                                        {
                                            text: 'Esci',
                                            handler: CL.app.getController("C_tbar").doLogout,
											icon: "images/icons/icon_exit.png"
                                        }
                                    ]
								}

							]
						}
					]
				},
				'->'
			];
        }
		
		

        this.callParent(arguments);
    }

	
});
