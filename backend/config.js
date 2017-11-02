module.exports = {
	dbConfig: {
          user: 'postgres',
		//   password: '#2017BlurBiz@T*',
		password: '123456',
        	database: 'blurbiz',
	        port: 5432
	},
	mailConfig: {
		auth: {
			user: 'no.reply.blurbiz@gmail.com',
			pass: 'td#blurbiz123'
		},
		template_signup_confirmation: {
		        'from': 'no.reply.blurbiz@gmal.com',
		        'subject': 'Signup confirmation',
		        'html': '<b>To finish registration follow the link:</b> link_placeholder'
		},
		template_reset_password: {
			'from': 'no.reply.blurbiz@gmal.com',
                        'subject': 'Reset password',
                        'html': '<b>To reset password follow the link:</b> link_placeholder'
		},
		
		confirm_admin_create_user:{
		  from    : 'no.reply.blurbiz@gmal.com',
		  subject : 'Welcome to Blurbiz',
		  html    : '\
		    <div>Hi, <%= name %></div></br>\
		    <div>Your new Blurbiz account is now ready, you can login using the information below.</div></br>\
		    <div>Email Address: <%= email %></div>\
		    <div>Password: <%= password %></div></br>\
		    <div>Please go to https://app.blurbiz.net/#/login to start</div></br>\
		    <div>Happy Creating :)</div>'
		},
		
		
		admin_invite_user:{
		  from    : 'no.reply.blurbiz@gmal.com',
		  subject : 'Welcome to Blurbiz',
		  html    : '\
		    <div>Hello,</div></br>\
		    <div>You have been invited to join <%=company%>’s Blurbiz Platform, Please click the link below to setup your account and start creating.</div></br>\
		    <div>http://app.blurbiz.net/#/invite/<%=invite_id%></div>\
		    <div>Cheers,</div>\
        <div>The Blurbiz Team</div>'
		},
		
	},
	tokenKey: 'secret_token_key',
	s3_config: {
		BUCKET_NAME: "blurbiz-media",
		ACCESS_KEY: "AKIAJ76FOT7IZL4K5B5A",
		SECRECT_KEY: "WcaFbktZtKVLLA1qbmk2UsDaBDczC4oUFWLw9ell",
	},
	azure_config: {
		AZURE_STORAGE_ACCOUNT: "blurbizstagdiag910",
		AZURE_STORAGE_ACCESS_KEY: "pSHwhNc49LdASEC/HMJGruOPtnfOOs5v01REsMVGNEQl/1AZW+VH6nVfHbAXrs38386PM8cEkalags2seHA0Vw==",
		AZURE_STORAGE_CONNECTION_STRING : "DefaultEndpointsProtocol=https;AccountName=blurbizstagdiag910;AccountKey=pSHwhNc49LdASEC/HMJGruOPtnfOOs5v01REsMVGNEQl/1AZW+VH6nVfHbAXrs38386PM8cEkalags2seHA0Vw==;EndpointSuffix=core.windows.net"
	},
	social: {
		google: {
			client_id: '944689281546-s3o8lk1e093a3mjetpfgj9hic7r5saae.apps.googleusercontent.com',
			client_secret: '352y_1R_ZGuH_H3sCV8jbHR2',
			redirect_url: 'http://localhost:8260/',
			refresh_token: '1/CwbKPK_k0meRhQTcMU5_zhQ_AGvRseovWv1845CrCTk'
		},
		facebook: {
			client_id: '1696648550655713',
			client_secret: '37e9e111a43b65beaa4dae1f2ff8ba80'
		},
		twitter: {
			consumer_key: 'miw3pUPe1vsZgnlz8d9YjJPLI',
			consumer_secret: 'BXzIJFQB5434MRjxaSgWtfKXmRUjDjwytx8iPcJcVzDPlOaKt0',
			// api_key: process.env.TWITTER_KEY || '774424738852724736-625ZoLF4xRU9ZxdHZCQ57Sv52IQaac1',
			// api_secret: process.env.TWITTER_SECRET || 'KaUf3cOyhPisj4vXQpzBknrRr2CiEAAWJ317KLgs0Z29F'

			// consumer_key: process.env.TWITTER_CONSUMER_KEY || //'IjzQZd1JqYjFMBX60lwQ3vYPA',
			// consumer_secret: process.env.TWITTER_CONSUMER_SECRET || //'uRoKlwATJrLfLMERrqYz3aqhLpMd35a5LhPBvzKsIQ48IZAgD8',
			// api_key: process.env.TWITTER_KEY || //'774424738852724736-625ZoLF4xRU9ZxdHZCQ57Sv52IQaac1',
			// api_secret: process.env.TWITTER_SECRET || //'KaUf3cOyhPisj4vXQpzBknrRr2CiEAAWJ317KLgs0Z29F'

			// consumer_key: process.env.TWITTER_CONSUMER_KEY || 'SvaHY9X43kJ1zS7ItrhP3yqlH',
			// consumer_secret: process.env.TWITTER_CONSUMER_SECRET || 'soDLTUVtvAzpEAK2TKvAB2d4xwlwBEfZdpAvl8Nd6NcaKiOhck',
			// api_key: process.env.TWITTER_KEY || '775958126277173248-B8uzip0k2IGossYHjN2uhRxTuXgIETL',
			// api_secret: process.env.TWITTER_SECRET || '8glnX0ZolOAhJZjsw19SGg6CugnTpkhxtznGxuBsW3vPl'
		},
		instagram: {
			client_id: 	'6e3e49de0dbf4747a12665fd3c174d14',
			client_secret: '57afa2f8f70a4ace83a6ba1655e1d4be'
		},
		pinterest: {
			app_id: '4859150297689244984'
		}
	},
	USER_PHOTO_PROMISED_SIGN: -9999,
	INSTAGRAM_PHP_SERVER: 'http://localhost:4001',
	SNAPCHAT_PHP_SERVER: 'http://localhost:4002'
}
