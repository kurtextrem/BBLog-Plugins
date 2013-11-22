/**
* Adds an EA-Battlefield Server Status ThumbUp or -Down.
*
* @author Pun1a, Kurtextrem
* @version 1.0.4

* @url http://www.skillmonster.de - Hosted by 4Netplayers.de

* Licensed under CC BY-NC-ND 3.0
* Link: http://creativecommons.org/licenses/by-nc-nd/3.0/deed.de
*/

BBLog.handle("add.plugin", {
	id : "cheat-o-meter-plugin",
	name : "Cheat-O-Meter",

	init : function(instance) {
		this.handler(instance);
	},

	domchange : function(instance) {
		this.handler(instance);
	},


	translations : {
		"en" : {
			"cheatometer.cheatpossibility" : "Cheater Possibility",
			"cheatometer.loading": "Loading"
		},
		"de" : {
			"cheatometer.cheatpossibility" : "Cheater-Warscheinlichkeit",
			"cheatometer.loading": "Läd"
		},
	},

	handler : function(instance) {
		var count = $("html").find(".username > h1").length;
		if(count == 1) {
			var count = $("html").find("#profile-cheatinfo").length;
			if(count == 0) {
				var code = '<section id="profile-cheatinfo"><hr><h3>Cheat O Meter</h3>';
				code += '<div id="Cheat_O_Meter_Section"><img src="http://battlelog-cdn.battlefield.com/cdnprefix/d61a6d36ca51801/public/base/shared/ajax-loader.gif"> <a style="color:#000;text-decoration:none;font-weight:normal" href="#">'+instance.t('cheatometer.loading')+'...</a></div>';
				code += '</section>';

				$("#profile-main-column > .box:first").append(code);

				var profileLink = $('.profile-avatar > a').attr('href'),
				username = profileLink.match(/user\/(.+)\//)[1]
				$.getJSON(
					"http://www.skillmonster.de/products/bblog/plugins/API/Cheat_O_Meter.php?p="+username+"&t="+new Date().getTime(),
					function(data) {
						if(data.error == false) {
							var value = parseFloat(data.value);
							var color = "green";
							if(value > 2.5) color = "darkorange";
							if(value > 5) color = "red";
							$("#Cheat_O_Meter_Section").html('<a href="http://www.team-des-fra.fr/CoM/bf3.php?p='+username+'" target="_blank">'+instance.t("cheatometer.cheatpossibility")+': <span style="color:'+color+'">'+value+'%</span></a>');
						} else {
							$("#Cheat_O_Meter_Section").html('<a href="http://www.team-des-fra.fr/CoM/bf3.php?p='+username+'" target="_blank">'+data.message+'</a>');

						}
					}
				);
			}
		}
	}
})

