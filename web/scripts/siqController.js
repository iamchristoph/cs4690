var app = angular.module('siqApp', []);
app.controller('siqController', function($scope, $http){

	var url = 'http://localhost:3000/api/v1';
	var siq = this;
	siq.undo = [];
	
	$http.get(url + '/entries.json')
		.then(function(response){
			siq.data = response.data;
		});
	siq.index = -1;
	siq.panelNum = -1;
	siq.upsertEntry = function(subject, content){
		if(siq.operation === 'New Entry'){
			siq.postEntry(siq.data.length, subject, content);
		}
		else{
			siq.updateEntry(siq.index, subject, content);
		}
	};

	siq.editClick = function(index)
	{
		siq.operation = 'Edit Entry'; 
		siq.index = index;
		siq.siqSubject = siq.data[index].subject;
		siq.siqContent = siq.data[index].content;
	};

	siq.getEntry = function(index){
		siq.panelNum = siq.panelNum == index ? -1 : index;
		var id = siq.data[index]._id;
		console.log('getting entry ' + id);

		$http.get(url + '/entries/' + id + '.json')
			.then(function(response){
				siq.data[index] = response.data;
			});
	};

	siq.updateEntry = function(index, subject, content){
		var id = siq.data[index]._id;
		var entry = {};
		entry._id = id;
		entry.subject = subject;
		entry.content = content;
		siq.data[index] = entry;
		siq.clear();
		$http.put(url + '/entries/' + id + '.json', entry)
			.then(function(response){
				console.log("update finished with status '" + response.data + "'");
			});
	};

	siq.deleteEntry = function(index){
		console.log('deleting ' + index + '...');
		var id = siq.data[index]._id;
		var element = siq.data.splice(index, 1)[0];

		$http.get(url + '/entries/' + id + '.json')
			.then(function(response){
				element = response.data;
				element.index = index;
				siq.undo.push(element);
			});

		siq.panelNum = -1;
		$http.delete(url + '/entries/' + id)
			.then(function(response){
				console.log("delete finished with status '" + response.data + "'");
			});
	};

	siq.postEntry = function(index, subject, content){
		// {"subject":"Something else","content":"This is the content for 'Something else'"}
		var entry = {};
		entry.subject = subject;
		entry.content = content;
		siq.clear();
		console.log(entry);
		$http.post(url + '/entries.json', entry)
			.then(function(res){
				console.log(`success:${res.data}`);
				entry._id = res.data;
				siq.data.splice(index, 0, entry);
			}, function(err){
				console.log(`error: ${err.data}`);
			});
	};

	siq.Undo = function(){
		var element = siq.undo.pop();
		siq.postEntry(element.index, element.subject, element.content);
	};

	siq.clear = function(){
		siq.siqContent = "";
		siq.siqSubject = "";
	};
});