Ext.define('CL.model.M_collection_user', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'collection_id',             type: 'int'},
        {name: 'user_id',                   type: 'int'},
        {name: 'is_coworker_manager',       type: 'boolean'},

        {name: 'user_name',                 type: 'string'}, //cognome+nome
        {name: 'group_id',                  type: 'int'},
        {name: 'group_name',                type: 'string'},
        {name: 'url_icon',                  type: 'string'},
        {name: 'icon_tooltip',              type: 'string'}
    ]
});