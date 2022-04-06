
var Main = function () {
	var isPrint = function () {
		return window.location.href.indexOf("print") > -1
		// return true
	}
	var getJson = function () {
		$.ajax({
			type: "GET",
			url: "/bio.json",
			contentType: "application/json",
			dataType: "json",
			beforeSend: function () {
				$('#introduction').show();
			},
			success: function (data) {
				if (isPrint()) {
					if (data.limit.max_experience) {
						data.experience = data.experience.slice(0, data.limit.max_experience);
					}
					if (data.limit.max_education) {
						data.education = data.education.slice(0, data.limit.max_education);
					}
				}
				var exp = data.experience;
				var new_exp = [];
				exp.forEach(function(e){
					e.f_start_date = formatDate(e.start_date, "mm yyyy");
					e.f_end_date = formatDate(e.end_date, "mm yyyy");
					new_exp.push(e);
				});
				data.experience = new_exp;

				
				var percent = data.skills.main;
				var new_percent = [];
				percent.forEach(function(e){
					e.percent = (e.value * 100) + '%';
					e.type = (e.value > 0.8 ? "Advance" : e.value > 0.6 ? "Intermediate" : "Beginner");
					new_percent.push(e);
				});
				data.skills.main = new_percent;
				
				var other = data.skills.other;
				var new_other = [];
				other.forEach(function(e){
					e.percent = (e.value * 100) + '%';
					e.type = (e.value > 0.8 ? "Advance" : e.value > 0.6 ? "Intermediate" : "Beginner");
					new_other.push(e);
				});
				data.skills.other = new_other;
				
				for(n in data) {
					if (!isPrint() && n == 'contacts_alt') {
						continue;
					}
					if (typeof(data[n]) != "object") {
						if(n == "birthday") {
							var date = data[n];
							age(date);
							data[n] = formatDate(date);
						}
						$('.' + n).html(data[n]);
					} else {
						if (data[n] instanceof Array) {
							var template = $('#' + n + '_template').html();
							Mustache.parse(template);   // optional, speeds up future uses
							var rendered = Mustache.render(template, data);
							$('#' + n + '_template').html(rendered);
							$('#' + n + '_template').show();
						}
					}
					if (n == 'skills') {
						for(s in data.skills) {
							var template = $('#skills_'+s+'_template').html();
							Mustache.parse(template);   // optional, speeds up future uses
							var rendered = Mustache.render(template, data.skills);
							$('#skills_'+s+'_template').html(rendered);
							$('#skills_'+s+'_template').show();
							$('[data-toggle="popover"]').popover();
						}
					}
				}
				if (!isPrint()) {
					for(n in data.contacts) {
						if (n == "email") {
							$('.email').html(data.contacts[n]);
							$('.email').attr("href", "mailto:" + data.contacts[n]);
						} else if (n == "whatsapp") {
							$('.whatsapp').html(data.contacts[n]);
							$('.whatsapp').parent().attr("href", "http://wa.me/" +data.contacts[n].replace(/\D/g,''));
						} else {
							$('.' + n).attr("href", data.contacts[n]);
						}
					}
				}
			}
		});
	}
	
	var formatDate = function(date_s, type = "default") {
		if (typeof date_s == 'undefined') return "Now";
		
		var date = new Date(date_s);
		var monthNames = [
		  "January", "February", "March",
		  "April", "May", "June", "July",
		  "August", "September", "October",
		  "November", "December"
		];
	  
		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();
		if (type == "default") {
			return monthNames[monthIndex] + ' ' + ordinalSuffix(day) + ', ' + year;
		} else if (type == "mm yyyy") {
			return monthNames[monthIndex] + ' ' + year;
		}
	}

	var ordinalSuffix = function (i) {
		var j = i % 10,
			k = i % 100;
		if (j == 1 && k != 11) {
			return i + "st";
		}
		if (j == 2 && k != 12) {
			return i + "nd";
		}
		if (j == 3 && k != 13) {
			return i + "rd";
		}
		return i + "th";
	}

	var age = function (date) {
		function _calculateAge(birthday) { // birthday is a date
			var ageDifMs = Date.now() - birthday.getTime();
			var ageDate = new Date(ageDifMs); // miliseconds from epoch
			return Math.abs(ageDate.getUTCFullYear() - 1970);
		}
		var age = _calculateAge(new Date(date))
		$("#age").html(age)
	}
	
	return {
		init: function () {
			getJson();
		}
	}
}();

jQuery(document).ready(function () {
	Main.init();
});

