'use strict';
const https = require('https');
const quoteUrl1 = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';
const quoteUrl2 = 'https://quotes.rest/qod';
var DataBase = {
	"emp": []
};
var empid = 1;
// empDB CRUD operations 


var empcrud = function () {};


/* helper functions. */
function getindex(id) {
	for (var i = 0; i < DataBase.emp.length; i++) {
		if (DataBase.emp[i].id == id)
			return i;
	}
	return -1;
}

function roleValidator(role) {
	switch (role.toUpperCase()) {
		case "CEO":
			break;
		case "MANAGER":
			break;
		case "VP":
			break;
		case "LACKEY":
			break;
		default:
			throw "Role not Valid:: Must be oneof the follwing ::CEO  Manager VP  LACKEY";
	}

}

function dateValidator(date) {

	var dateformate = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
	var currentdate = "";
	var d = new Date();
	if (dateformate.test(date)) {
		if (!(new Date(date).getTime() < Date.parse(currentdate.concat(d.getFullYear(), "-", d.getMonth(), "-", d.getDate()))))
			throw "Date Must be Past to  :" + currentdate.concat(d.getFullYear(), "-", d.getMonth(), "-", d.getDate());
	} else throw "Date Format Not valid::Must be YYYY-MM-DD";
}


function nameValidator(name) {
	var nameFormat = /^[a-zA-Z]+$/;
	if (name != null && (nameFormat.test(name)))
		return;
	throw "name not valid";
}

function createValidator(fname, lname, date, role) {


	roleValidator(role);
	dateValidator(date);
	try {
		nameValidator(lname);
	} catch (err) {
		throw "Last Name Not Valid";
	}
	try {
		nameValidator(fname);
	} catch (err) {
		throw "First Name Not Valid";
	}
}

/*makesget request*/
function getData(options, callback) {
	try {
		https.request(options, function (res) {
			var body = '';
			res.on('data', function (chunk) {
				body += chunk;
			});
			res.on('end', function () {
				var result = body;
				callback(result);
			});
		}).end();
	} catch (err) {
		throw "invalid  data Quotation Host:";
	}
}


/* helper functions end */

// Post Data comes here for insertion
empcrud.prototype.createRecord = function (req, callback) {
	try {
		var validator = createValidator(req.body.firstName, req.body.lastName, req.body.hireDate, req.body.role);

		DataBase.emp.push({
			"id": "numeric index",
			"firstName": "firstname",
			"lastName": "lastname",
			"hiredate": "YYYY-MM-DD",
			"role": "CEO",
			"favoriteQuote": "external api data",
			"SecondfavoriteQuote": "external api data"
		});

		var index = DataBase.emp.length - 1;

		DataBase.emp[index].id = empid;
		DataBase.emp[index].firstName = req.body.firstName;
		DataBase.emp[index].lastName = req.body.lastName;
		DataBase.emp[index].hiredate = req.body.hireDate;
		DataBase.emp[index].role = req.body.role;
		/* handler for adding First Favotare quote*/
		getData(quoteUrl1, function (result) {
			try {
				var obj = JSON.parse(result);

				DataBase.emp[index].favoriteQuote = obj[0];
			} catch (err) {

			}

		});
		/*handler for adding second favorate quote*/
		getData(quoteUrl2, function (result) {
			try {
				var obj = JSON.parse(result);
				DataBase.emp[index].SecondfavoriteQuote = obj.contents.quotes[0].quote;
			} catch (err) {

			}

		});

		empid++;
		callback(null, "sucess");
	} catch (err) {
		callback(err, null);
	}

};

/*retrive record by id */
empcrud.prototype.add = function (id, callback) {

	if (DataBase.emp.length >= id && id != 0) {

		callback(null, DataBase.emp[getindex(id)]);
	} else {
		callback("record not found", null);
	}
};

empcrud.prototype.DBlength = function () {
	console.log(DataBase.emp.length);
	return DataBase.emp.length;
};

empcrud.prototype.getAll = function (callback) {
	if (DataBase.emp.length <= 0) {
		return callback("No Employee records", null);
	}
	return callback(null, DataBase.emp);

};


empcrud.prototype.Update = function (req, callback) {


};

empcrud.prototype.remove = function (id, callback) {
	if (DataBase.emp[getindex(id)]) {
		var delPosition = getindex(id);
		var removed = DataBase.emp.splice(delPosition, 1);
		console.log(removed);
		return callback(null, "Employee record deleted");
	}

	return callback("No record found with Specified Id", null);
};

module.exports = empcrud;
