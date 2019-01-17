var Main = function () {
	var getJson = function () {
		$.ajax({
			type: "GET",
			url: "/bio.json",
			contentType: "application/json",
			dataType: "json",
			success: function (data) {
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
				
				for(name in data) {
					if (typeof(data[name]) != "object") {
						if(name == "birthday") {
							var date = data[name];
							age(date);
							data[name] = formatDate(date);
						}
						$('.' + name).html(data[name]);
					} else {
						if (data[name] instanceof Array) {
							// console.log(typeof(data[name]), name);
							var template = $('#' + name + '_template').html();
							Mustache.parse(template);   // optional, speeds up future uses
							var rendered = Mustache.render(template, data);
							$('#' + name + '_template').html(rendered);
							$('#' + name + '_template').show();
						}
					}
					if (name == 'skills') {
						for(name1 in data.skills) {
							var template = $('#skills_'+name1+'_template').html();
							Mustache.parse(template);   // optional, speeds up future uses
							var rendered = Mustache.render(template, data.skills);
							$('#skills_'+name1+'_template').html(rendered);
							$('#skills_'+name1+'_template').show();
						}
					}
				}
				for(name in data.contacts) {
					if (name == "email") {
						$('.email').html(data.contacts[name]);
						$('.email').attr("href", "mailto:" + data.contacts[name]);
					} else if (name == "whatsapp") {
						$('.whatsapp').html(data.contacts[name]);
					} else {
						$('.' + name).attr("href", data.contacts[name]);
					}
				}
				
			}
		});

		// var view = {
		// 	title: "Joe",
		// 	calc: function () {
		// 	  return 2 + 4;
		// 	}
		// };
		  
		// var output = Mustache.render("{{title}} spends {{calc}}", view);
		// console.log(output);
	}
	
	var formatDate = function(date_s, type = "default") {
		
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
		console.log(age)
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
	$(function () {
		$('[data-toggle="popover"]').popover()
	})
});

