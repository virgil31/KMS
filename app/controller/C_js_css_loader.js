Ext.define('CL.controller.C_js_css_loader', {
    extend: 'Ext.app.Controller',

    js_to_load: null,
    js_loaded: null,

    css_to_load: null,
    css_loaded: null,
 
    to_load: null,
    loaded: null,


    /**
     *
     * JS
     *
     *
     */

    loadJS: function(src,callback){
        var me = this;
        var script = document.createElement('script'),
            loaded;
        script.setAttribute('src', src);
        if (callback) {
            script.onreadystatechange = script.onload = function() {
                if (!loaded) {
                    callback();
                }
                loaded = true;
            };
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    },


    loadJSs: function (srcs, callback) {
        var me = this;

        //inizializzo
        me.js_to_load = srcs.length;
        me.js_loaded = 0;

        srcs.forEach(function(src){
            me.loadJS(src,function(){
                me.js_loaded++;
                //console.log("js_loaded: "+me.js_loaded);
                if(me.js_loaded == me.js_to_load) {
                    //console.log("JS LOADED");
                    callback();
                }
            });
        });
    },


    /**
     *
     * CSS
     *
     *
     */



    loadCSS: function(src,callback){
        var me = this;

        var link = document.createElement('link'),
            loaded;

        link.setAttribute('rel', "stylesheet");
        link.setAttribute('type', "text/css");
        link.setAttribute('href',src);

        if (callback) {
            link.onreadystatechange = link.onload = function() {
                if (!loaded) {
                    callback();
                }
                loaded = true;
            };
        }
        document.getElementsByTagName('head')[0].appendChild(link);
    },


    loadCSSs: function (srcs, callback) {
        var me = this;

        //inizializzo
        me.css_to_load = srcs.length;
        me.css_loaded = 0;

        srcs.forEach(function(src){
            me.loadCSS(src,function(){
                me.css_loaded++;
                //console.log("css_loaded: "+me.css_loaded);
                if(me.css_loaded == me.css_to_load) {
                    //console.log("CSS LOADED");
                    callback();
                }
            });
        });
    },

    /**
     *
     * GENERIC
    *
    *
    */

    load: function (srcs,callback) {
        var JSs = new Array();
        var CSSs  = new Array();

        var me = this;

        srcs.forEach(function (src) {
            var extension = src.split('.').pop();
            if(extension.toLowerCase() === "js")
                JSs.push(src);
            else
                CSSs.push(src);
        });

        me.loadJSs(JSs,function(){
            if(me.css_loaded == me.css_to_load) {
                //console.log("loadJSs -> FINITO (css caricati attualmente: "+me.css_loaded+"/"+me.css_to_load);
                callback();
            }
        });

        me.loadCSSs(CSSs,function(){
            if(me.js_loaded == me.js_to_load) {
                //console.log("loadCSs -> FINITO (js caricati attualmente: "+me.js_loaded+"/"+me.js_to_load);
                callback();
            }
        });
    }


});

