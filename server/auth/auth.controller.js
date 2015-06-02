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
					req.user = user;
					var token = Auth.setTokenCookie(req, res);
					return res.status(200).json({
						token: token,
						user: user
					});
				});
			} else {
				console.log(res.cookie);
				Auth.setTokenCookie(req, res);
				console.log(res.cookie);
				return res.status(200).send(user);
			}
		});
	});
	/*
*/
}