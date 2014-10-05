addChatClientLogic = function () {
	var socket = io();
	var userName;
	var newUserInfo = {};
	var userData = {};
	var onlineUsers = [];
	var date, time, hours, minutes, seconds;

	var htmlHeight = $('html').height();
	$('#messages').css('max-height', htmlHeight - 80);


	// $('.chat').hide();

	$('#createUser').click(function(){
		var pathToForm = document.forms.form;
	    newUserInfo = {
		    name: pathToForm.elements.name.value,
		    color: pathToForm.elements.color.value,
	    }
	    userName = newUserInfo.name;
	    if ( userName.length !== 0 ) {
	    	$('.form').hide();
			$('.chat').show();
			$('#m').focus();
			socket.emit('user login', newUserInfo);
	    } else {
	    	return;
	    } 
	});

	function makeSound(noice) {
		var sound = document.getElementById(noice);
		sound.play();
	}

	socket.on('user login', function(serverName, serverNameColor, serverOnlineUsers) {

		$('#messages').prepend($('<p class="server_massage">').text(serverName + " logined"));
		$('#onlineUsers').empty();

		for ( var i = 0; i < serverOnlineUsers.length; i++ ) {
			$('#onlineUsers').prepend('<p>' + serverOnlineUsers[i] + '</p>');
		}
	});

	$('form').submit(function(){
		date = new Date();
		hours = (date.getHours() < 10 ? '0' : '' ) + date.getHours();
		minutes = (date.getMinutes() < 10 ? '0' : '' ) + date.getMinutes();
		seconds = (date.getSeconds() < 10 ? '0' : '' ) + date.getSeconds();
		time = [hours, minutes, seconds];

		userData.time = time;
		userData.name = userName;
		userData.color = newUserInfo.color;
		userData.massage = $('#m').val();

		console.log("userData: " + typeof(userData), userData )

		socket.emit('chat message', $('#m').val(), time, userData);
		userData = {};
		$('#m').val('');
		return false;
	});

	socket.on('chat message', function(serverName, serverNameColor, time, msg){
		makeSound('audio1');
		$('#messages').prepend('<li lass="chat_massage">[' + time[0] + ":" + time[1] + ":" + time[2] + "] " + '<span class="user_name" style="color:' + serverNameColor + '">' + serverName + '</span>' + ": " + msg + '</li>');
	});

	socket.on('disconnect', function(msg, serverOnlineUsers){
		$('#messages').prepend($('<p class="server_massage">').text(msg + ' disconected'));
		$('#onlineUsers').empty();

		for ( var i = 0; i < serverOnlineUsers.length; i++ ) {
			$('#onlineUsers').prepend('<p>' + serverOnlineUsers[i] + '</p>');
		}
	});

	socket.on('drawHistory', function(history){
		var newHistory = jQuery.parseJSON(history);
		console.log(newHistory);
		for ( p in  newHistory) {
			$('#messages').prepend('<li lass="chat_massage">' + newHistory[p].time[0] + ":" + newHistory[p].time[1] + ":" + newHistory[p].time[2] + " " + '<span class="user_name" style="color:' + newHistory[p].color + '">' + newHistory[p].name + '</span>' + ": " + newHistory[p].massage + '</li>');
		}
		
	});

}

addChatClientLogic();































