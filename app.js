const app = require("express")();
const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const fileUpload = require('express-fileupload');
const output = require("./app/helpers/output.helper").Output;
const autogens = require("./app/helpers/bill.generators");
const http = require("http");
const https = require('https');
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;
const server = http.createServer(app);
const io = require("socket.io")(server);
io.serveClient(false);
const globals = require("./app/helpers/global.params");
globals.socket_io = io;
const public_dir = path.join(__dirname, "public");
globals.basedir = __dirname;
globals.views_dir = path.join(__dirname, "app", "views");
globals.private_dir = path.join(__dirname, "private-files");
const custom_env = require("./app/libs/application.enviroment");
var env = new custom_env("staging").ENV();
globals.env = env;
const logger = require("./app/libs/logger");

const PORT = env.PORT || 3000;
const base_url = env.BASE_URL.trim();
var base_domain = base_url;
base_domain = base_domain.replace('https://', '');
base_domain = base_domain.replace('http://', '');

let my_req=null;
let my_res=null;
app.use(output);
app.use("/favicon.ico", express.static(path.join(public_dir, "assets", "images", "favicon.png")));
app.use(function(req, res, next) {
	my_req = req;
	my_res = res;
	res.setHeader('Access-Control-Allow-Origin', base_domain);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token");
	res.setHeader('Access-Control-Allow-Credentials', true);
	req.__base_url = base_url;
	req.public_url = env.PUBLIC_URL;
	req.__base_domain = base_domain;
	next();
});

app.use(compression()); //use compression
app.use(cookieParser());
app.disable("x-powered-by");
app.set("view engine", "ejs");
app.set("views", globals.views_dir);
const MySQLStore = require("express-mysql-session")(session);
var options = {
	host: env.DB_HOST,
	port: 3306,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
	clearExpired: true,
	checkExpirationInterval: 60000, //1 min
	expiration: 1800000, //30mins
	endConnectionOnClose: true,
	createDatabaseTable: true,
	schema: {
		tableName: "tbl_user_sessions",
		columnNames: {
			session_id: "session_id",
			expires: "expires",
			data: "session_data",
		},
	},
};
const sessionConfig = {
	secret: env.SESSION_KEY,
	name: env.SESSION_NAME,
	key: env.SESSION_NAME,
	resave: true,
	saveUninitialized: true,
	rolling: true,
	store: new MySQLStore(options),
	secure: true,
	httpOnly: true,
	cookie: {
		sameSite: "strict",	
	},
};
if(env.ENVIROMENT === "production") {
	app.set("trust proxy", 1);
	sessionConfig.cookie.secure = true;
}
app.use(express.json({
	limit: "1mb",
}));
app.use(express.urlencoded({
	limit: "1mb",
	extended: true
}));
app.use(session(sessionConfig));
app.use(express.static(public_dir, {
	etag: false,
	maxAge: 365 * 24 * 3600000,
}));
app.use(cors({
	origin: env.HOST_NAME,
	optionsSuccessStatus: 200,
}));

app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: '/tmp/'
}));

//app.use("/8ckqrhxjopiy7z1w", require("./app/routes/pesa"));



app.use("/public", require("./app/routes/public"));


app.use(csrf())
app.use(function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.locals.csrftoken = req.csrfToken();
  next();
});

app.use("/", require("./app/routes/app"));

app.use(function(req, res) {
	if(req.method == "GET") {
		if(req.xhr) {
			res.renderEjs(req, "errors/not-found-ajax");
		} else {
			res.status(404);
			res.renderEjs(req, "errors/not-found");
		}
	} else {
		res.errorEnd("Requested content cannot be located");
	}
});

app.use(function(err, req, res, next) {	
	if(err.status==404){
		if(req.method == "GET") {
			if(req.xhr) {
				res.renderEjs(req, "errors/not-found-ajax");
			} else {
				res.status(404);
				res.renderEjs(req, "errors/not-found");
			}
		} else {
			res.errorEnd("Requested content cannot be located");
		}
		return;
	}

	logger.log(err);
	if(req.method == "GET") {
		if(req.xhr) {
			res.renderEjs(req, "errors/error-ajax");
		} else {
			res.status(err.status || 500);
			res.render("errors/error", {
				message: err.message,
				load_chunk: req.xhr,
				base_url: req.__base_url,
				user_profile: req.user_profile,
				error: {}
			});
		}
	} else {
		if(req.xhr) {
			if(err.code == "EBADCSRFTOKEN") {
				res.errorEnd("Invalid form request or form tampered! Please refresh your browser and try again.");
			}else{
				res.errorEnd("An error occured while processing your request.");
			}	
		} else {
			res.status(err.status || 500);
			res.render("errors/error", {
				message: err.message,
				load_chunk: req.xhr,
				base_url: req.__base_url,
				user_profile: req.user_profile,
				error: {}
			});
		}
			
	}
});

process.on('unhandledRejection', (reason, p) => {	
	logger.promise(reason);		
	if(my_req.method == "GET") {
		if(my_req.xhr) {
			my_res.renderEjs(my_req, "errors/error-ajax");
		} else {
			my_res.status(500);
			my_res.render("errors/error", {
				message: 'A technical error has occurred',
				load_chunk: my_req.xhr,
				base_url: my_req.__base_url,
				user_profile: my_req.user_profile,
				error: {}
			});
		}
	} else {
		my_res.errorEnd("An error occured while processing your request.");
	}
	
});


function intervalFunc() {
	autogens.serverAutoGenerate(true);//autogenerate bills
}
setInterval(intervalFunc, 1000);
server.listen(PORT, () => {
	console.log(`server running at ${base_url}`);
});