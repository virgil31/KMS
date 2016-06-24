Ext.define('CL.controller.C_tbar', {
    extend: 'Ext.app.Controller',

    stores: [
        //
    ],
    models: [
        //
    ],
    views: [
        'tbar.V_tbar'
    ],

    /////////////////////////////////////////////////
    init: function () {
        this.control({
            //DO LOGIN
            'tbar button[action=do_login]': {
                click: this.doLogin
            },

            //DO LOGOUT
            //'tbar button[action=do_logout]':{
            //    click: this.doLogout
            //}
        }, this);
    },
    /////////////////////////////////////////////////

    //DO LOGIN
    doLogin: function(btn){



        Ext.Ajax.request({
            url: 'data/session/login.php',
            method: "POST",
            params: {
                username: Ext.ComponentQuery.query("tbar textfield[name=username]")[0].getValue(),
                password: btoa(btoa(btoa(Ext.ComponentQuery.query("tbar textfield[name=password]")[0].getValue())))
            },
            success: function(response, opts) {
                var risposta = Ext.decode(response.responseText);

                if(risposta["success"]){
                    var expiration_date = new Date();
                    expiration_date.setYear(expiration_date.getYear()+1901);
                    Ext.util.Cookies.set("user_id",risposta['user_id'],expiration_date,'/','192.168.1.6');
                    Ext.util.Cookies.set("username",risposta['username'],expiration_date,'/','192.168.1.6');

                    location.reload();
                }
                else{
                    Ext.toast({
                        title: 'Credenziali errate!',
                        html: "<strong>Assicurarsi che non sia attivato il CAPS LOCK.</strong>",
                        bodyStyle: 'color: #963232; background: #333333',
                        closable: true,
                        align: 'br',
                        slideInDuration: 500,
                        width: 200,
                        height: 100
                    });
                }

            }
        });


    },

    //DO LOGOUT
    doLogout: function () {
        Ext.util.Cookies.clear("user_id");        
        location.reload();
    }
});
