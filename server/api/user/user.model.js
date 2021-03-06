'use strict';

var mongoose 	= require('mongoose'),
	Schema 		= mongoose.Schema,
	crypto 		= require('crypto'),
	authTypes 	= ['github', 'twitter', 'facebook', 'google'];

	var _ = require('lodash');

var UserSchema = new Schema({
	id: Number,
	username: { type: String },
	name: { type: String, required: true },
	picture: String,
	bio: String,
	email: { type: String, lowercase: true, required: true  },
	role: {	type: String, default: 'user'},
	hashedPassword: String,
	provider: String,
	salt: String,
	facebook: {},
	twitter: {},
	google: {},
	github: {},
	location: String,
	tickets: [{
		eid: { type: Number, default: 0 }, //event id
		tid: { type: Number, default: 0 }, // event ticket ID
		role: { type: String, default: 'guest'},
		info: {
			duration: { start: Date, end: Date },
			price: { type: Number, default: 0 },
			category: String
		},
		status: { type: Number, default: 2 }, // 0: Cancelled  - 1 Active - 2 Pending
		linkedWith: Number,
		participantID: String
	}],
	favorites: [Number], // TODO {id, date}
	badges: [Number]
});

/**
 * Virtuals
 */
UserSchema
	.virtual('password')
	.set(function(password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function() {
		return this._password;
	});

// Public profile information
UserSchema
	.virtual('profile')
	.get(function() {
		return {
			'name': this.name,
			'role': this.role
		};
	});

// Non-sensitive info we'll be putting in the token
UserSchema
	.virtual('token')
	.get(function() {
		return {
			'_id': this._id,
			'role': this.role
		};
	});

/**
 * Validations
 */

// Validate empty email
UserSchema
	.path('email')
	.validate(function(email) {
		if (authTypes.indexOf(this.provider) !== -1) return true;
		return email.length;
	}, 'Email cannot be blank');

// Validate empty password
UserSchema
	.path('hashedPassword')
	.validate(function(hashedPassword) {
		if (authTypes.indexOf(this.provider) !== -1) return true;
		return hashedPassword.length;
	}, 'Password cannot be blank');

// Validate email is not taken
UserSchema
	.path('email')
	.validate(function(value, respond) {
		var self = this;
		this.constructor.findOne({email: value}, function(err, user) {
			if(err) throw err;
			if(user) {
				if(self.id === user.id) return respond(true);
				return respond(false);
			}
			respond(true);
		});
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
	return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
	.pre('save', function(next) {
		if (!this.isNew) return next();
		if (!this.username) {
			this.username = _.snakeCase(this.name);
		}
		if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1) {
			next(new Error('Invalid password'));
		} else {
			var self = this;
			self.constructor
			.findOne()
			.sort('-id')
			.exec(function (err, member) {
				if (!member) {
					self.id = 1;
				} else {
					self.id = member.id + 1;
				}
				next();
			});
		}
	});

/**
 * Methods
 */
UserSchema.methods = {
	/**
	 * Authenticate - check if the passwords are the same
	 *
	 * @param {String} plainText
	 * @return {Boolean}
	 * @api public
	 */
	authenticate: function(plainText) {
		return this.encryptPassword(plainText) === this.hashedPassword;
	},

	/**
	 * Make salt
	 *
	 * @return {String}
	 * @api public
	 */
	makeSalt: function() {
		return crypto.randomBytes(16).toString('base64');
	},

	/**
	 * Encrypt password
	 *
	 * @param {String} password
	 * @return {String}
	 * @api public
	 */
	encryptPassword: function(password) {
		if (!password || !this.salt) return '';
		var salt = new Buffer(this.salt, 'base64');
		return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
	}
};

module.exports = mongoose.model('User', UserSchema);
