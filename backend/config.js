module.exports = {
	dbConfig: {
        	user: 'postgres',
	        password: 'postgres',
        	database: 'blurbiz',
	        port: 5432
	},
	mailConfig: {
		auth: {
			user: 'no.reply.blurbiz@gmail.com',
			pass: 'td#blurbiz123'
		},
		template: {
		        'from': 'no.reply.blurbiz@gmal.com',
		        'subject': 'Signup confirmation',
		        'html': '<b>To finish registration follow the link:</b> link_placeholder'
		}
	},
	tokenKey: 'secret_token_key'
}
