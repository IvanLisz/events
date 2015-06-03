var config 		= require('../config/environment'),
	User 		= require('../api/user/user.model'),
	Auth 		= require('./auth.service'),
	FB 			= require('fb');

FB.options({
	appId:          config.facebook.clientID,
	appSecret:      config.facebook.clientSecret,
	redirectUri:    config.facebook.callbackURL
});

exports.login = function (req, res) {
	switch (req.body.service) {
		case 'facebook':
			_facebookLogin(req, res);
			break;
	}
};

function _facebookLogin (req, res) {
	FB.api('me', { fields:'name,email,first_name,picture', access_token: req.body.service_token }, function (profile) {
		if (profile.error) {
			return res.status(500).send(profile.error);
		}
		User.findOne({
			'facebook.id': profile.id
		},
		function (err, user) {
			if (err) {
				return res.status(500).send(err);
			}
			if (!user) {
				user = new User({
					name: profile.name,
					picture: profile.picture.data.url,
					email: profile.email,
					role: 'user',
					provider: 'facebook',
					facebook: profile
				});

				user.save(function(err) {
					if (err) res.status(500).send(err);
					Auth.sendUser(req, res, user);
				});
			} else {
				Auth.sendUser(req, res, user);
			}
		});
	});
	/*
*/
}