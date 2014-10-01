addChatClientLogic = function () {
	var socket = io();
	var userName;
	var newUserInfo = {};
	var onlineUsers = [];
	var date, time, hours, minutes, seconds;

	$('.chat').hide();

	$('#createUser').click(function(){
		$('.form').hide();
		$('.chat').show();

			var pathToForm = document.forms["form"];
		    newUserInfo = {
			    name: pathToForm.elements["name"].value,
			    color: pathToForm.elements["color"].value,
		    }
		    userName = newUserInfo.name;
		    console.log(newUserInfo);
		    socket.emit('user login', newUserInfo);
	});

	

	socket.on('user login', function(serverName, serverNameColor, serverOnlineUsers) {

		$('#messages').prepend($('<p class="server_massage">').text(serverName + " logined"));
		$('#onlineUsers').empty();

		for ( var i = 0; i < serverOnlineUsers.length; i++ ) {
			$('#onlineUsers').prepend('<p>' + serverOnlineUsers[i] + '</p>');
		}
		console.log(serverOnlineUsers);
	});

	$('form').submit(function(){
		var date = new Date();
		hours = (date.getHours() < 10 ? '0' : '' ) + date.getHours();
		minutes = (date.getMinutes() < 10 ? '0' : '' ) + date.getMinutes();
		seconds = (date.getSeconds() < 10 ? '0' : '' ) + date.getSeconds();
		time = [hours, minutes, seconds];

		socket.emit('chat message', $('#m').val(), time);
		$('#m').val('');
		return false;
	});

	socket.on('chat message', function(serverName, serverNameColor, time, msg){
		$('#messages').prepend('<li lass="chat_massage">' + time[0] + ":" + time[1] + ":" + time[2] + " " + '<span class="user_name" style="color:' + serverNameColor + '">' + serverName + '</span>' + ": " + msg + '</li>');
	});

	socket.on('disconnect', function(msg, serverOnlineUsers){
		$('#messages').prepend($('<p class="server_massage">').text(msg + ' disconected'));
		$('#onlineUsers').empty();

		console.log(serverOnlineUsers);

		for ( var i = 0; i < serverOnlineUsers.length; i++ ) {
			$('#onlineUsers').prepend('<p>' + serverOnlineUsers[i] + '</p>');
		}
	});

}

addChatClientLogic();