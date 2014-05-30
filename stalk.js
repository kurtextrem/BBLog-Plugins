/**
  * Adds an extended friendlist to the battlelog.
  *
  * Thanks to Pun1a for some basic code.
  *
  * @author 	Kurtextrem
  * @version	1.3.23
  * @date 	2014-05-28
  * @url		http://kurtextrem.de
  * @license 	CC BY-NC-ND 3.0 http://creativecommons.org/licenses/by-nc-nd/3.0/deed.de
  */
  $.fn.ready(function() {
	'use strict';

	var plugin = {
		/** @type 	{String} 		The extension's id. 		*/
		id: 'extended-friends-plugin',
		/** @type 	{String}		The extension's name.  		*/
		name: 'Extended Friendlist',
		/** @type 	{String} 		The version string.		*/
		version: '1.3.23',
		/** @type 	{Object} 		BBL Translation stuff.		*/
		translations : {
			"en" : {
				"fix.exp" : "EXP Event Banner Fix",
				"fix.exp.tooltip" : "Fixes the EXP Event banner, to better fit the main page.",
				"fix.showAll": "Show 'All' everytime in the Game Activity window.",
				"firstStepText1": "Extended Friendlist Information",
				"firstStepText2": "Welcome!",
				"firstStepText3": "In order to add someone to the extended friendlist visit his profile and press the yellow 'Add to ext. friendlist' button.",
				"firstStepText4": "The extended friendlist is displayed below the offline friendlist.",
				"firstStepText5": "If you want to refresh the list, press the refresh button next to the search button in the 'COM Center' line.",
				"firstStepText6": "Please report bugs in the BBL Forum.",
				"firstStepText7": "New in this version:",
				"firstStepText8": "Fix for new Battlelog. See wrong nicknames in the FL.",
				"buttonTooltip": "Add this player to your extended friendlist.",
				"buttonRemoveTooltip": "Remove this player from your extended friendlist.",
				"refreshTooltip": "Last update:",
				"showFriends": "Show Friends",
				"away": "Away",
				"remove": "Remove!",
				"unknown": "Unknown."
			},
			"de" : {
				"fix.exp" : "EXP Event Banner Fix",
				"fix.exp.tooltip" : "Verändert den Event Banner, damit weniger Platz beansprucht wird.",
				"fix.showAll": "Immer 'Alles' anzeigen in der Spiel Aktivität.",
				"firstStepText1": "Erweiterte Freundesliste Informationen",
				"firstStepText2": "Willkommen!",
				"firstStepText3": "Um jemanden zu deiner erweiterten Freundesliste hinzuzufügen, musst du sein Profil besuchen und den gelben 'Add to ext. friendlist' klicken.",
				"firstStepText4": "Die erweiterte Freundesliste ist unter der Offline Freundesliste.",
				"firstStepText5": "Wenn du die erweiterte Freundesliste aktualisieren willst, musst du das aktualisieren Icon in neben dem Suche Icon in der 'COM Center' Zeile drücken.",
				"firstStepText6": "Melde Fehler bitte im Forum.",
				"firstStepText7": "Neu in dieser Version:",
				"firstStepText8": "Funktionsfähig nach Battlelog Update. Falsche Namen sind in der Liste sichtbar.",
				"buttonTooltip": "Spieler zur erweiterten Freundesliste hinzufügen.",
				"buttonRemoveTooltip": "Spieler von der erweiterten Freundesliste entfernen.",
				"refreshTooltip": "Letzte Aktualisierung:",
				"showFriends": "Freunde anzeigen",
				"away": "Abwesend",
				"remove": "Entfernen!",
				"unknown": "Unbekannt."
			},
			"pt" : {
				"fix.exp" : "Ajuste do Banner Evendo de Experiência Dobrada",
				"fix.exp.tooltip" : "Ajusta o Banner Evento de Experiência Dobrada para melhor paginação.",
				"fix.showAll": "Mostrar 'TUDO' na janela de Atividade de Jogo.",
				"firstStepText1": "Informação da Lista Estendida de Amigos",
				"firstStepText2": "Bem-vindo!",
				"firstStepText3": "Para adicionar amigos à sua lista estendida acesse o perfil requerido e clique em 'Ad. à lista estendida'.",
				"firstStepText4": "A lista estendida é mostrada abaixo da lista de amigos offline.",
				"firstStepText5": "Se desejar atualizar a lista pressione o botão 'Atualizar' próximo à caixa de procura",
				"firstStepText6": "Por favor, reporte erros no Fórum do BBLog",
				"firstStepText7": "O que há de novo:",
				"firstStepText8": "Ajuste ao novo Battlelog ao mostrar nome errados na lista estendida.",
				"buttonTooltip": "Adicione este soldado à lista estendida",
				"buttonRemoveTooltip": "Remover este soldado da lista estendida",
				"refreshTooltip": "Última Atualização:",
				"showFriends": "Mostrar Amigos",
				"away": "Ocupado",
				"remove": "Remover!",
				"unknown": "Desconhecido."
			},
		},
		/** @type 	{Object} 		Config flags from BBL.		*/
		configFlags : [
			['fix.exp', 1],
			['fix.showAll', 1],
			['showFriends', 1, function(instance) {
				instance.showFriends()
			}]
		],

		/** @type 	{Object} 		BBLogs main instance. 		*/
		instance: {},
		/** @type 	{Array} 		Holds each player for the extended friendlist. 	*/
		extendedFriends: [],
		/** @type 	{Array} 		Holds the excluded players. 		*/
		optedOut: ['l_like_Chocolate'],
		/** @type 	{String}	 	HTML Code Cache 		*/
		htmlCache: '',
		/** @type 	{Int}		Last update count in seconds.		 */
		lastUpdate: 0,
		/** @type 	{Bool}		Whether Currently updating.		*/
		updating: false,
		languageAddition: '',

		/**
		 * Adds values to variables, adds the extended friendlist to the normal friendlist
		 *
		 * @author 	Kurtextrem
		 * @date 	2013-10-18
		 * @param  	{Object}		BBLogs main instance.
		 */
		 init: function(instance) {
			this.instance = instance
			this.languageAddition = BBLog.cache('language') === 'en' ? '' : '/' + BBLog.cache('language')
			this.extendedFriends = this.instance.storage('plugin.extendedfriends') || []
			this.htmlCache = window.localStorage['extfriends.htmlCache'] || ''
			this.lastUpdate = window.localStorage['extfriends.lastUpdate'] || 0
			if (this.languageAddition !== window.localStorage['extfriends.languageAddition']) {
				this.lastUpdate = 0
				window.localStorage['extfriends.languageAddition'] = this.languageAddition
			}
			if (($.now() - this.lastUpdate) / 1000 > 120)
				this.htmlCache = ''
			this.handler()
			this.addRefreshButton()
			this.addAjaxListener()
			if (this.htmlCache === '') {
				this.addSeparator()
				this.addList()
			}

			var string = 'FirstStep111',
			select = $('.main-loggedin-leftcolumn-activity-filter')
			window.setTimeout(function() {
				if (select.find('li:first-of-type').hasClass('selected') && instance.storage('fix.showAll'))
					select.find('li:last-of-type').click()
			}, 1000)

			if (!instance.storage(string)){
				this.alert('welcomealert', this.instance.t('firstStepText1')+' v'+this.version, "<strong>"+this.instance.t('firstStepText2')+"</strong><p>"+this.instance.t('firstStepText3')+"</p><p>"+this.instance.t('firstStepText4')+"</p><p>"+this.instance.t('firstStepText5')+"</p><p>"+this.instance.t('firstStepText6')+"</p><p><strong>"+this.instance.t('firstStepText7')+"</strong> "+this.instance.t('firstStepText8')+"</p>", function(){
					instance.storage(string, true);
				})
			}
		 },

		/**
		 * Calls the main handler on dom change.
		 *
		 * @author 	Kurtextrem
		 * @date 	2013-05-19
		 */
		 domchange: function() {
			this.handler()
		 },
		/**
		 * Checks if is user profile or if list got removed.
		 *
		 * @author 	Kurtextrem, Pun1a
		 * @date 	2013-10-29
		 */
		 handler: function() {
			var html = $('html'),
			select = BBLog.cache('mode') === 'bf4' ?  '.user-container .username span' : '.username > h1',
			count = html.find(select).first().length,
			list = html.find('#comcenter-extfl-separator').length
			if (count === 1) {
				count = html.find('#extendedFriendsButton').length
				if (count === 0)
					this.addButton()
			}
			if (list === 0) {
				$('#comcenter-offline-separator').parent().after(this.htmlCache)
				$('#comcenter-tab-friends-content').jScrollPane({horizontalGutter: -7, verticalGutter: -7})
				if (!this.updating)
					$('#comcenterExtFlFriends > span').append('<i> -Cache-</i>')
				else
					this.spinner(true)
			}

			// EXP event fix
			if (this.instance.storage('fix.exp')) {
				$('.main-loggedin-premium-scoremultiplier').css('position', 'absolute').css('right', 0)
				$('#main-loggedin-premium-scoremultiplier-icon').css('top', '5px')
			}
		},
		/**
		 * Adds the button to the profile page.
		 *
		 * @author 	Kurtextrem
		 * @date   	2013-09-04
		 */
		 addButton: function() {
			var btn = $('<span class="bblog-button" id="extendedFriendsButton" data-tooltip="'+this.instance.t('buttonTooltip')+'" style="position:absolute;top:15px;white-space:nowrap;left:100%;margin-left:5%">Add to ext. friendlist</span>'),
			username = window.location.href.match(/\/user\/([^\/]+)/)[1],
			select = '#profile-header .interact'

			if(this.isOptedOut(username))
				return

			if (this.extendedFriends.indexOf(username) !== -1) {
				btn.text('Remove from ext. friendlist').attr('data-tooltip', this.instance.t('buttonRemoveTooltip'))
			}
			if (BBLog.cache('mode') === 'bf4') {
				select = '.user-container .interact .box-content'
				btn.removeClass('.bblog-button').addClass('btn btn-primary btn-tiny')
				btn.css('position', 'static')
			}
			$(select).append(btn)
			btn.click(function() {
				this.toggleName(username)
			}.bind(this))
		 },
		/**
		 * Adds / removes the name from the extended friendslist.
		 *
		 * @author 	Kurtextrem
		 * @date   	2013-05-19
		 * @param  	{String} 		name
		 */
		 toggleName: function(name, dontRefresh) {
			this.extendedFriends = this.instance.storage('plugin.extendedfriends') || []
			var index = this.extendedFriends.indexOf(name)
			if (index === -1)
				this.extendedFriends.push(name)
			else
				this.extendedFriends.splice(index, 1)
			this.instance.storage('plugin.extendedfriends', this.extendedFriends)
			if (!dontRefresh)
				this.refresh()
		 },
		/**
		 * Removes and adds the extended friendlist again.
		 *
		 * @author 	Kurtextrem
		 * @date   	2013-05-19
		 */
		 refresh: function() {
			$('#extendedFriendsButton').remove()
			$('#comcenter-extfl-separator').parent().remove()
			$('.extFlPlaying, .extFlOnline').remove()
			this.addSeparator()
			this.addList()
		 },
		/**
		 * Adds the extended friendlist.
		 *
		 * @author 	Kurtextrem, Pun1a
		 * @date   	2013-10-03
		 */
		 addList: function() {
			if (this.updating)
				return
			var length = this.extendedFriends.length

			if (length > 0) {
				this.spinner(true)
				this.updating = true
			}
			$(this.extendedFriends).each(function(i, player) {
				var playerName = player,
				profileLink = this.languageAddition + '/bf' + (BBLog.cache('mode') === 'bf4' ? '4' : '3') + '/user/' + playerName
				$.ajax(profileLink, {
					type: 'GET',
					headers: {'X-AjaxNavigation': 1, 'X-Requested-with': 'xmlhttprequest'},
					success: function(json) {
						if (!json || !json.context || typeof json.context.profileCommon === 'undefined')
							return this.buildTemplate(playerName)
						if (!json.context.profileCommon.user.presence.isOnline)
							return
						var profileCommon = json.context.profileCommon,
						playerID = json.globalContext.profileUserId,
						idle = '',
						gravatarImg = 'http://www.gravatar.com/avatar/'+profileCommon.user.gravatarMd5+'?s=36&d=http%3A%2F%2Fbattlelog-cdn.battlefield.com%2Fcdnprefix%2Favatar1%2Fpublic%2Fbase%2Fshared%2Fdefault-avatar-36.png'
						if (typeof profileCommon.user.presence.isAway !== 'undefined' || typeof profileCommon.user.presence.presenceState === 65537 ) {
							idle = this.instance.t('away')
						}
						if (typeof profileCommon.user.presence.isPlaying !== 'undefined') {
							if (typeof profileCommon.user.presence.playingMp !== 'undefined') {
								var guid = profileCommon.user.presence.playingMp.serverGuid,
								serverName = profileCommon.user.presence.playingMp.serverName,
								game = profileCommon.user.presence.playingMp.game,
								serverLink = this.languageAddition + '/bf' + (game === 2048 ? '4' : '3')  + '/servers/show/pc/' + guid + '/', //if (profileCommon.user.presence.playingMp.platform === 1)
								platform = profileCommon.user.presence.playingMp.platform,
								friendPersonaId = profileCommon.user.presence.playingMp.personalId

								return this.buildTemplate(playerName, playerID, profileLink, gravatarImg, false, '', true, game, platform, serverName, serverLink, guid, friendPersonaId)
							}
						}
						return this.buildTemplate(playerName, playerID, profileLink, gravatarImg, idle)
					}.bind(this),
					error: function() {
						this.buildTemplate(playerName)
					}.bind(this)
				}).done(function() {
					if (i === length - 1)
						window.setTimeout(function() {
							this.updating = false
							this.spinner(false)
							this.lastUpdate = $.now()
							window.localStorage['extfriends.lastUpdate'] = this.lastUpdate

							$('#comcenter-tab-friends-content').jScrollPane({horizontalGutter: -7, verticalGutter: -7})
						}.bind(this), 1000)
				}.bind(this))
			}.bind(this))

			$(document).on('click', '.removeExtFl', function(e) {
				var $target = $(e.target)
				$target.parents('.comcenter-friend').fadeOut(5000)
				this.toggleName($target.data('nick'), true)
				e.preventDefault()
			}.bind(this))
		},
		/**
		 * Creates the template.
		 *
		 * @author 	Kurtextrem
		 * @date   	2013-10-03
		 * @param  	{string} 	playerName 		The player name.
		 * @param  	{string} 	playerID 		The player id.
		 * @param  	{string} 	profileLink 		The profile link.
		 * @param  	{string} 	background 		The background image.
		 * @param  	{string} 	idle 		Wether is idle or not.
		 * @param  	{string} 	extra 		Extras like specific background-color
		 * @param  	{bool} 	playing 		Wether is playing or not
		 * @param  	{string} 	game 		Game type
		 * @param  	{string} 	platform		Platform type
		 * @param  	{string} 	serverName 		server name
		 * @param  	{string} 	serverLink 		server link
		 * @param  	{string} 	guid 		guid
		 * @param  	{string} 	friendPersonaId 	friendPersonaId
		 */
		 buildTemplate: function(playerName, playerID, profileLink, background, idle, extra, playing, game, platform, serverName, serverLink, guid, friendPersonaId) {
			// presencestate:2/3 = mobile<span class="icon-mobile icon-grey"></span> used in the interact container
			var button = '', playerhtml = '', idle2 =  '', class1 = '', add = '', class2 = 'online'
			if (typeof playerID === 'undefined') {
				playerID = $.now()
				profileLink = '#'
				background = 'http://battlelog-cdn.battlefield.com/cdnprefix/avatar1/public/base/shared/default-avatar-36.png'
				idle = this.instance.t('remove')
				extra = 'style="background-color:rgba(255,0,0,.55)"'
				button = true
			}
			if (typeof playing === 'undefined')
				playing = ''
			if (idle) {
				idle2 = '<div class="comcenter-username-away">' + idle + '</div>'
				if (button)
					idle2 = '<div class="comcenter-username-away"><span class="bblog-button tiny removeExtFl" data-nick="' + playerName + '">' + idle + '</span></div>'
				idle = ' comcenter-username-idle'
			}
			if (playing) {
				idle = ''
				class1 = ' comcenter-friend-playing'
				class2 = 'playing'
				if (serverLink === null && serverName === null) {
					serverLink = '#'
					serverName = this.instance.t('unkown')
				}
				// data-tooltip="Warning: you're about to change the Battlelog, because the soldier is playing another BF version." data-tooltip-position="left"
				idle2 = '<div class="comcenter-username-serverinfo origin-game-title"><span class="common-gameicon-hori bright common-game-'+game+'-'+platform+' comcenter-game-icon"></span><span class="common-playing-link" data-track="friend.playing.server.link"><a title="'+serverName+'" class="common-playing-link comcenter-playing-link" href="'+serverLink+'">'+serverName+'</a></span></div>'
				if (game === 2048)
					add = ' btn-primary'
				playing = '<button class="btn btn-small join-friend-submit-link join-friend join-friendcomcenter-interact-playing'+add+'" data-bind-action="join-mp-gameserver" data-role="1" data-guid="'+guid+'" data-game="'+game+'" data-platform="1" data-friendpersonaid="'+friendPersonaId+'" data-track="friend.playing.server.join"><i class="icon-join-friend"></i></button></div>' // role = 1 = play, 4 = obs
			}
			if (typeof extra === 'undefined')
				extra = ''
			playerhtml = '<surf:container id="comcenter-surface-friends_'+playerID+'" class="extFLFriend"><li id="comcenter-'+playerID+'" class="comcenter-friend-item comcenter-friend comcenter-friend-online'+class1+'" rel="'+	playerID+'"'+extra+'><div class="comcenter-avatar"><a href="'+profileLink+'"><i class="avatar medium '+class2+'" style="background-image:url('+background+')"></i></a></div><div class="comcenter-username'+idle+'"><a class="comcenter-username-link" href="'+profileLink+'">'+unescape(playerName)+'</a>'+idle2+'</div><div class="comcenter-interact-container">'+playing+'</li></surf:container>'
			if (playing !== '')
				return this.addHTML('.extFlPlaying', playerhtml)
			return this.addHTML('.extFlOnline', playerhtml) // #comcenter-extfl-separator
		},
		/**
		 * Adds the html to the obj.
		 *
		 * @author 	Kurtextrem
		 * @date   	2013-10-03
		 * @param  	{string} 	elem	The selector for the elem.
		 * @param  	{string} 	html 	The html to add.
		* @param  	{bool}	after	Whether it is appended or added after.
		*/
		addHTML: function(elem, html, after) {
			elem = $(elem)
			if (after)
				elem.after(html)
			else
				elem.append(html)

			html = $('.extFlOnline').parent().html()
			if (html === null)
				return this.refresh()
			html = '<div>'+html+'</div>'
			return this.addCache(this.addSeparator(true)+html)
		},
		/**
		 * Adds the value to the session cache.
		 *
		 * @author 	Kurtextrem
		 * @date   	2013-09-28
		 * @param  	{string} 	val	The value to add.
		 * @param  	{bool}	override	Whether it should override or not.
		 */
		 addCache: function(val) {
			this.htmlCache = val
			return window.localStorage['extfriends.htmlCache'] = val
		 },
		/**
		 * Adds the refresh button (only if not there yet).
		 *
		 * @author 	Kurtextrem
		 * @date   	2013-10-01
		 */
		 addRefreshButton: function() {
			var refresh = $('#extFLRefresh')

			if (typeof refresh[0] === 'undefined') {
				refresh = $('<img id="extFLRefresh" src="http://kurtextrem.de/bbl/refresh.png" style="position:absolute;top:10px;right:4px;cursor:pointer">')
				refresh.load(function() {
					$('#friendlist-header > i').before(refresh)
				}.bind(this)).click(function() {
					if (($.now() - this.lastUpdate) / 1000 > 4)
						this.refresh()
				}.bind(this)).hover(function() {
					this.updateRefreshTitle(refresh)
				}.bind(this))
			}
		 },
		/**
		 * Updates the refresh icon's tooltip.
		 *
		 * @author 	Kurtextrem
		 * @date   	2013-09-04
		 * @param  	{object} 	refreshObj 	represents the icon
		 */
		 updateRefreshTitle: function(refreshObj) {
			var update = ($.now() - this.lastUpdate) / 1000
			refreshObj.attr('title', this.instance.t('refreshTooltip')+' '+Math.floor(update, 1)+'s ') // ago.
		},
		/**
		 * Adds the separator.
		 *
		 * @author 	Kurtextrem
		 * @date   	2013-10-03
		 * @param  	{bool} 	ret	Whether only the html should be returned.
		 */
		 addSeparator: function(ret) {
			var html = '<surf:container id="comcenterOnlineFriends"><li id="comcenter-extfl-separator" class="comcenter-separator online"><surf:container id="comcenterExtFlFriends"><span style="cursor:default">Ext. Friendlist</span></surf:container></li></surf:container>'
			if (ret)
				return html
			html += '<div><div class="extFlPlaying"></div><div class="extFlOnline"></div></div>'
			this.addHTML('[id^="comcenter-surface-friends_"]:last-of-type', html)
		 },
		/**
		 * Displays the ext friendlist friends in a new modal window.
		 *
		 * @author 	Kurtextrem
		 * @date   	2013-10-01
		 */
		 showFriends: function() {
			var html = '',
			length = this.extendedFriends.length,
			player = '',
			$popup

			html += '<table style="border:0;width:50%;margin:auto">'
			for (var i = 0; i < length; i++) {
				html += '<tr>'
				player = this.extendedFriends[i]
				html += '<td>'
				html += '<a href="http://battlelog.battlefield.com' + this.languageAddition + '/bf' + (BBLog.cache('mode') === 'bf4' ? '4' : '3') + '/user/'+player+'/">'+unescape(player)+'</a> '
				html += '</td>'
				html += '<td>'
				html += '<span data-nick="'+player+'"  style="cursor:pointer" title="'+this.instance.t('remove')+'">(X)</span>'
				html += '</td>'
				html += '</tr>'
			}
			html += '</table>'

			this.alert('friendsalert', this.instance.t('firstStepText1') + ' v' + this.version, html, function() {
				$('#extFLRefresh').click()
			})
			$popup = $('#popup-friendsalert')
			$popup.find('.common-popup-content-container').css({
				overflow: 'auto',
				height: '382px'
			})
			$popup.find('td > span').click(function(e) {
				var $target = $(e.target)
				$target.parents('tr').fadeOut(5000)
				this.toggleName($target.data('nick'), true)
			}.bind(this))
		 },
		/**
		 * Add a loading indicator.
		 *
		 * @author 	Kurtextrem
		 * @date   	2013-09-04
		 */
		 spinner : function(add) {
			return  add ? $('#comcenterExtFlFriends').append('<span class="loader small extFlSpinner" style="margin-left:7px"></span>') : $('.extFlSpinner').remove()
		 },
		/**
		 * Registers a clicks again for the Surce ajax Navigation thing.
		 *
		 * @author 	Kurtextrem
		 * @date   	2013-09-05
		 */
		 addAjaxListener: function() {
			$(document).on('click', '#popup-friendsalert a, .extFLFriend a', function(e) {
				Surface.ajaxNavigation.navigateTo($(this).attr('href'))
				e.preventDefault()
			})
		 },
		/**
		 * Checks if a player is opted out.
		 *
		 * @author 	Kurtextrem
		 * @date   	2013-05-19
		 * @param  	{String} 		name
		 * @return 	{Bool}
		 */
		 isOptedOut: function(name) {
			return this.optedOut.indexOf(name) !== -1
		 },

		 alert: function (id, title, text, callback) {
			var footer = $('<div class="popup-prompt-buttons"><div style="text-align:right"><input type="button" class="ok-btn base-button-arrow-small popup-prompt-button-continue" value="' + BBLog.t('ok') + '"/><div class="base-clear"></div></div>')
			if (!callback)
				callback = function () {}
			text = '<div>' + text + '</div>'
			footer.find('.common-popup-close-button').on('click', function () {
				callback(null)
				BBLog.closeAllPopups()
			})
			footer.find('.ok-btn').on('click', function () {
				callback(true)
				BBLog.closeAllPopups()
			})
			BBLog.popup(id, title, text, footer)
		 }
	}
	window.setTimeout(function() {
		BBLog.handle('add.plugin', plugin)
	}, 1000)
})
