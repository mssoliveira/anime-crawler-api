'use strict';

var cheerio = require('cheerio'),
	request = require('request'),
	settings = require('../settings'),
	reqOptions = require('../req-options');

exports.list_all = function (res) {
	var url = settings.base_path + '/lista-de-generos-online';

	request(url, reqOptions, function (error, response, body) {
		if (response.statusCode !== 200 || error) {
			res.json({
				err: true,
				msg: 'Não foi possível carregar as categorias.',
			});
			return;
		}

		console.log(new Date().getTime());

		var array = [];
		var $ = cheerio.load(body);
		$('.generosPagContainer')
			.find('a')
			.each(function () {
				array.push({
					title: $(this).text().trim(),
					slug: $(this)
						.attr('href')
						.split('=')
						.filter(String)
						.slice(-1)
						.pop(),
				});
			});

		res.json(array);
	});
};
