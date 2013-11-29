"use strict"
/**
* Copy & load emblems.
*
* Thanks to cowboy for this gist: https://gist.github.com/cowboy/6815966.
*
* @author 	Jacob Groß (Kurtextrem)
* @version	1.0.6.4
* @date 	2013-11-17
* @url 	http://kurtextrem.de
* @license 	CC BY-NC-ND 3.0 http://creativecommons.org/licenses/by-nc-nd/3.0/deed.de
*/
BBLog.handle('add.plugin', {
	/** @type 	{String} 		The extension's id. 		*/
	id: 'manage-emblems',
	/** @type 	{String}		The extension's name.  		*/
	name: 'Manage Emblems',
	/** @type 	{String} 		The version string.		*/
	version: '1.0.6.31',
	/** @type 	{Object} 		BBL Translation stuff.		*/
	translations : {
		"en" : {
			"add.emblem": 'Add a Emblem menu point.',
			"add.dogtags": 'Add a Dog Tags menu point.'
		},
		"de" : {
			"add.emblem": 'Emblem Menü Punkt hinzufügen.',
			"add.dogtags": 'Dog Tags Menü Punkt hinzufügen.'
		}
	},
	 /** @type 	{Object} 		Config flags from BBL.		*/
	configFlags : [
	         ["add.emblem", 1],
	         ["add.dogtags", 1]
	 ],
	 /** @type 	{Object} 		BBLogs main instance. 		*/
	 instance: {},
	 /** @type 	{Array} 		Dropdown element.		*/
	 dropdown: [null],
	 /** @type 	{Array} 		@see getMatches 		*/
	 matches: [null, null, null],
	 /** @type 	{Bool} 		Whether the user has a soldier or not.	*/
	 hasSoldier: false,

	/**
	 * Called on first load. Checks if we're in the BF4 battlelog, if yes let's do the work.
	 *
	 * @author 	Kurtextrem
	 * @date 	2013-10-29
	 */
	 init: function(instance) {
	 	this.instance = instance
	 	if (BBLog.cache('mode') === 'bf4') {
	 		this.handler()
	 		this.addAjaxListener()
	 		this.getMatches()
	 		if (this.hasSoldier)
	 			this.addLink()
	 	}
	 },

	/**
	 * If dom got changed there is a possibility that we're on the emblem's page now.
	 *
	 * @see  	init()
	 * @author 	Kurtextrem
	 * @date 	2013-10-06
	 */
	 domchange: function() {
	 	if (BBLog.cache('mode') === 'bf4')
	 		this.handler()
	 },
	/**
	 * Checks if the new buttons are there, if not it adds them.
	 *
	 * @author 	Kurtextrem
	 * @date 	2013-10-29
	 */
	 handler: function() {
	 	var html = $('html'),
	 	count = html.find('#emblem-edit').length,
	 	count2,
	 	count3 = html.find('.user-container .username span').first().length,
	 	count4 = html.find('.dialog.emblempreview .btn').length

	 	if (count3 === 1 || count4 > 0) {
	 		count3 = html.find('#emblemLibButton').length
	 		if(count3 === 0 && this.hasSoldier)
	 			this.addLibButton(!!count4)
	 	}
	 	if(count === 1) {
	 		count = html.find('#emblem-copy-btn').length
	 		count2 = html.find('#emblem-load-btn').length
	 		if(count === 0)
	 			this.addButton('copy')
	 		if (count2 === 0)
	 			this.addButton('load')
	 	}
	 },
	 /**
	  * Adds the buttons + the event handlers.
	  *
	  * @author 	Kurtextrem
	  * @date   	2013-11-17
	  * @param  	{string} 	which 	What button type it should add
	  */
	 addButton: function(which) {
	 	var string = '<surf:container id="emblem-'+which+'-btn"><button id="emblem-action-'+which+'" class="btn btn-primary pull-right margin-left"><span>'+which+'</span></button></surf:container>'
	 	$('#emblem-edit > header').append(string)
	 	if (which === 'copy') {
	 		$('#emblem-action-copy').click(function(){
	 			var code = JSON.stringify(emblem.emblem.data, null, 2)
	 			BBLog.alert('copyalert', 'Copy', "<strong>Copy this code and save it:</strong><p><textarea id='emblemCode' style='width:98%;height:155px'>"+code+"</textarea></p><p>Or <a class='btn btn-tiny' id='dl-button'>download it</a> - <label><input type='text' id='emblemCustomText'> Custom Text</label></p><p>Share it directly (Note: if you share that link, your whole emblem library can be seen): <input type='text' id='emblemLibLink' readonly style='width:90%'></p>", function(){})
	 			window.setTimeout(function() {
	 				$('#dialog-container').show()
	 				var $copy = $('#popup-copyalert'),
	 				$text = $copy.find('#emblemCustomText'),
	 				$dl = $copy.find('#dl-button'),
	 				id = location.href.match(/personal\/(\d+)\//)[1],
	 				text = ''

	 				$text.keyup(function(){
	 					text = $text.val()
	 					if (text !== '')
	 						text += '-'
	 					$dl.attr('download', text+'emblem'+id+'.embblog')
	 				})
	 				$dl.attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(code)).attr('download','emblem'+id+'.embblog')
	 				$copy.find('#emblemLibLink').val(location.href)
	 				$copy.find('#emblemCode, #emblemLibLink').click(function() { $(this).select() } )
	 			}, 1000)
	 		})
	 	} else  {
	 		$('#emblem-action-load').click(function() {
				//$('.create-btn > a').click()
				BBLog.alert('loadalert', 'Load', "<strong>Insert the code here:</strong><p><textarea id='emblemLoadCode' style='width:98%;height:155px'></textarea></p><strong>Warning: If you don't create a new emblem, the current will be overwritten. Also, you need to save it manually. You can delete emblems using the link on the bottom of the page.</strong><p>Or <input type='file' id='importEmblem'></p>", function(){
					var val = $('#popup-loadalert #emblemLoadCode').val()
					val = val.replace('emblem.emblem.load(', '').replace('});', '}')
					emblem.emblem.load(val)
				})
				window.setTimeout(function() {
					$('#dialog-container').show()
					var select = $('#popup-loadalert'),
					im = select.find('#importEmblem')
					im.change(function(e){
						var f = e.target.files[0]

						if (!f.name.search('.embblog') === -1)
							return

						var reader = new FileReader()
						reader.onload = (function(theFile) {
						      	return function(e) {
						  		select.find('#emblemLoadCode').val(window.atob(e.target.result.replace('data:;base64,', '')))
							}
						})(f)
						reader.readAsDataURL(f)
					})
				}, 1000)
				//window.setTimeout(function() {
				//	$('#emblem-action-save').click()
				//}, 3000)
			})
		}
	},
	/**
	 * Adds the links, if enabled, in the main menu.
	 *
	 * @author 	Kurtextrem
	 * @date   	2013-10-10
	 */
	addLink: function() {
		var $dropdown = this.getMatches()[0],
		matches = this.getMatches()[1],
		name = $('.soldierstats-box .name > a').text(),
		lang = matches[1] || ''
		if (this.instance.storage('add.emblem'))
			$dropdown.append('<a href="/bf4/'+lang+'emblem/edit/active/'+matches[2]+'/1/"><i class="icon-white icon-servers"></i> <span>Emblem</span></a>')
		if (this.instance.storage('add.dogtags'))
			$dropdown.append('<a href="/bf4/'+lang+'soldier/'+name+'/dogtags/'+matches[2]+'/'+matches[3]+'/"><i class="icon-white icon-dogtags"></i> Dog Tags</a>')
	},
	/**
	 * Registers a clicks again for the Surce ajax Navigation thing.
	 *
	 * @author 	Kurtextrem
	 * @date   	2013-10-10
	 */
	addAjaxListener: function() {
		$(document).on('click', '.dropdown-content[data-for=stats] > row > .dropdown-menu:last-of-type a, #emblemLibButton', function(e){
			Surface.ajaxNavigation.navigateTo($(this).attr('href'))
			e.preventDefault()
		})
	},

	/**
	 * Adds the "view lib button".
	 *
	 * @author 	Kurtextrem
	 * @date   	2013-10-30
	 */
	addLibButton: function(modal) {
		var btn = $('<a href="#" class="btn btn-tiny" id="emblemLibButton" data-tooltip="View the player\'s emblem library.">View Lib</a>'),
			select = '.user-container .interact .box-content',
			matches = this.getMatches()[1],
			lang = matches[1] || '',
			emblemid = $('.soldier-data-container .soldier-emblem > img')
		if (modal) {
			select = '.dialog.emblempreview > footer'
			emblemid = $('.dialog.emblempreview img')
		}
		if (typeof emblemid[0] !== 'undefined') {
			emblemid = emblemid.attr('src').match(/emblem\/\d+\/\d+\/\d+\/(\d+)/)[1]
			btn.attr('href', '/bf4/'+lang+'emblem/edit/personal/'+emblemid+'/'+matches[2]+'/1/')
			$(select).append(btn)
		}
	},

	/**
	 * Returns the dropdown element, also language, soldierid and profileid
	 *
	 * @author 	Kurtextrem
	 * @date   	2013-10-30
	 * @return 	{array} 	[see description]
	 */
	getMatches: function() {
		if (this.dropdown[0] === null || this.matches[0] === null) {
			this.dropdown = $('.dropdown-content[data-for=stats] > .row > .dropdown-menu:last-of-type')
			if (typeof this.dropdown[0] !== 'undefined') {
				this.hasSoldier = true
				this.matches = this.dropdown.find('a').first().attr('href').match(/\/bf4\/(\w+\/)?soldier\/.*\/(\d+)\/(.*)\/$/)
			}
		}

		return [this.dropdown, this.matches]
	}
})