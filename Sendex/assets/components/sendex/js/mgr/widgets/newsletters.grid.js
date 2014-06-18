Sendex.grid.Newsletters = function(config) {
	config = config || {};
    this.sm = new Ext.grid.CheckboxSelectionModel();
	Ext.applyIf(config,{
		id: 'sendex-grid-newsletters'
		,url: Sendex.config.connector_url
		,baseParams: {
			action: 'mgr/newsletter/getlist'
		}
		,fields: ['id','name','description']
		,autoHeight: true
		,paging: true
		,remoteSort: true
        ,sm: this.sm
		,columns: [
			{header: _('id'),dataIndex: 'id',width: 70}
			,{header: _('name'),dataIndex: 'name',width: 200}
			,{header: _('description'),dataIndex: 'description',width: 250}
		]
		,tbar: [{
			text: _('sendex_btn_create')
			,handler: this.createNewsletter
			,scope: this
		}]
		,listeners: {
			rowDblClick: function(grid, rowIndex, e) {
				var row = grid.store.getAt(rowIndex);
				this.updateNewsletter(grid, e, row);
			}
		}
	});
	Sendex.grid.Newsletters.superclass.constructor.call(this,config);
};
Ext.extend(Sendex.grid.Newsletters,MODx.grid.Grid,{
	windows: {}

	,getMenu: function() {
        var cs = this.getSelectedAsList();
        var m = [];
        if (cs.split(',').length > 1) {
            m.push({
    			text: _('sendex_newsletters_remove')
    			,handler: this.removeSelected
    		});
        } else {
    		m.push({
    			text: _('sendex_newsletter_update')
    			,handler: this.updateNewsletter
    		});
    		m.push('-');
    		m.push({
    			text: _('sendex_newsletter_remove')
    			,handler: this.removeNewsletter
    		});
        }
		this.addContextMenuNewsletter(m);
	}
	
	,createNewsletter: function(btn,e) {
		if (!this.windows.createNewsletter) {
			this.windows.createNewsletter = MODx.load({
				xtype: 'sendex-window-newsletter-create'
				,listeners: {
					'success': {fn:function() { this.refresh(); },scope:this}
				}
			});
		}
		this.windows.createNewsletter.fp.getForm().reset();
		this.windows.createNewsletter.show(e.target);
	}

	,updateNewsletter: function(btn,e,row) {
		if (typeof(row) != 'undefined') {this.menu.record = row.data;}
		var id = this.menu.record.id;

		MODx.Ajax.request({
			url: Sendex.config.connector_url
			,params: {
				action: 'mgr/newsletter/get'
				,id: id
			}
			,listeners: {
				success: {fn:function(r) {
					if (!this.windows.updateNewsletter) {
						this.windows.updateNewsletter = MODx.load({
							xtype: 'sendex-window-newsletter-update'
							,record: r
							,listeners: {
								'success': {fn:function() { this.refresh(); },scope:this}
							}
						});
					}
					this.windows.updateNewsletter.fp.getForm().reset();
					this.windows.updateNewsletter.fp.getForm().setValues(r.object);
					this.windows.updateNewsletter.show(e.target);
				},scope:this}
			}
		});
	}

	,removeNewsletter: function(btn,e) {
		if (!this.menu.record) return false;
		
		MODx.msg.confirm({
			title: _('sendex_newsletter_remove')
			,text: _('sendex_newsletter_remove_confirm')
			,url: this.config.url
			,params: {
				action: 'mgr/newsletter/remove'
				,id: this.menu.record.id
			}
			,listeners: {
				'success': {fn:function(r) { this.refresh(); },scope:this}
			}
		});
	}

    ,getSelectedAsList: function() {
        var sels = this.getSelectionModel().getSelections();
        if (sels.length <= 0) return false;

        var cs = '';
        for (var i=0;i<sels.length;i++) {
            cs += ','+sels[i].data.id;
        }
        cs = cs.substr(1);
        return cs;
    }

    ,removeSelected: function(act,btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;

        MODx.msg.confirm({
			title: _('sendex_newsletters_remove')
			,text: _('sendex_newsletters_remove_confirm')
			,url: this.config.url
			,params: {
                action: 'mgr/newsletters/remove'
                ,newsletters: cs
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.getSelectionModel().clearSelections(true);
                    this.refresh();
                       var t = Ext.getCmp('modx-resource-tree');
                       if (t) { t.refresh(); }
                },scope:this}
            }
        });
        return true;
    }
});
Ext.reg('sendex-grid-newsletters',Sendex.grid.Newsletters);




Sendex.window.CreateNewsletter = function(config) {
	config = config || {};
	this.ident = config.ident || 'mecnewsletter'+Ext.id();
	Ext.applyIf(config,{
		title: _('sendex_newsletter_create')
		,id: this.ident
		,height: 200
		,width: 475
		,url: Sendex.config.connector_url
		,action: 'mgr/newsletter/create'
		,fields: [
			{xtype: 'textfield',fieldLabel: _('name'),name: 'name',id: 'sendex-'+this.ident+'-name',anchor: '99%'}
			,{xtype: 'textarea',fieldLabel: _('description'),name: 'description',id: 'sendex-'+this.ident+'-description',height: 150,anchor: '99%'}
		]
		,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
	});
	Sendex.window.CreateNewsletter.superclass.constructor.call(this,config);
};
Ext.extend(Sendex.window.CreateNewsletter,MODx.Window);
Ext.reg('sendex-window-newsletter-create',Sendex.window.CreateNewsletter);


Sendex.window.UpdateNewsletter = function(config) {
	config = config || {};
	this.ident = config.ident || 'meunewsletter'+Ext.id();
	Ext.applyIf(config,{
		title: _('sendex_newsletter_update')
		,id: this.ident
		,height: 200
		,width: 475
		,url: Sendex.config.connector_url
		,action: 'mgr/newsletter/update'
		,fields: [
			{xtype: 'hidden',name: 'id',id: 'sendex-'+this.ident+'-id'}
			,{xtype: 'textfield',fieldLabel: _('name'),name: 'name',id: 'sendex-'+this.ident+'-name',anchor: '99%'}
			,{xtype: 'textarea',fieldLabel: _('description'),name: 'description',id: 'sendex-'+this.ident+'-description',height: 150,anchor: '99%'}
		]
		,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
	});
	Sendex.window.UpdateNewsletter.superclass.constructor.call(this,config);
};
Ext.extend(Sendex.window.UpdateNewsletter,MODx.Window);
Ext.reg('sendex-window-newsletter-update',Sendex.window.UpdateNewsletter);