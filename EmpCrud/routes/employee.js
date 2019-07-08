'use strict';

const express = require('express');
const request = require('request');
const router = express.Router();
const empcrud = require('./../resource/empresource.js');
var emp = new empcrud();
/**post Handler**/
router.post('', function (req, res) {

	var response = emp.createRecord(req, function (err, result) {

		if (err) {
			res.status(500).send(err);
			return;
		}
		res.status(201).send(result);
	});

});

/*Post handler end*/

/* Handler for GET employees listing. */
router.get('', function (req, res) {
	emp.getAll(function (err, result) {
		if (err) {
			return res.status(204).send(err);

		}
		return res.status(200).json(result);
	});

});


/* Handler for  Get By Id */

router.get('/:id', function (req, res) {

	emp.add(req.params.id, function (err, Result) {
		if (err) {
			return res.status(204).send(err);

		}
		return res.status(200).json(Result);
	});
});


/* handler for Delete request by Id  */
router.delete('/:id', function (req, res) {

	emp.remove(req.params.id, function (err, result) {
		if (err) {
			return res.status(204).send(err);
		}
		return res.status(200).send(result);
	});
});

/* handler for PUT request with ID */
router.put('/:id', function (req, res) {

	emp.Update(req, function (err, result) {

		if (err) {
			return res.status(500).send(err);
		}
		return res.status(202).send(result);
	});
});

module.exports = router;
