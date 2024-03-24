import { logger } from './utils/logger.js';
import { db } from './database/db.js';
import { env } from './conifg/env.js';
import {
	HttpError,
	NotFoundError,
	ForbiddenError,
	UnauthorizedError,
	ValidationError,
	UnimplementedFunctionError,
} from './app.errors.js';

export function rateLimitHandler(req, res, next) {
	if (req.get('Content-Type') === 'application/json') {
		return res.json({ message: 'Too many requests, please try again later.' });
	}
	return res.status(429).render('./rate-limit.html');
}

export async function tenantHandler(req, res, next) {
	try {
		const subdomain = req.subdomains.length ? req.subdomains[0] : null;

		if (!subdomain) {
			return next();
		}

		const tenant = await db.select('*').from('tenants').where({ slug: subdomain }).first();

		if (!tenant) {
			throw new NotFoundError();
		}

		req.tenant = tenant;
		res.locals.app = {
			...res.locals.app,
			tenant,
		};

		return next();
	} catch (error) {
		next(error);
	}
}

export function localVariables(req, res, next) {
	res.locals.app = {
		env: env.env,
		mainDomain: env.env === 'production' ? 'http://jaw.lol' : `http://app.local`,
		configureDomain: (subdomain) => {
			if (env.env === 'production') {
				return `http://${subdomain}.jaw.lol`;
			}
			return `http://${subdomain}.app.local`;
		},
	};

	return next();
}

export function notFoundHandler(req, res, next) {
	if (!req.tenant) throw new NotFoundError();
	return res.status(404).render('./not-found.html', {
		tenant: JSON.stringify(req.tenant),
		layout: '../layouts/tenant.html',
	});
}

export function errorHandler(err, req, res, next) {
	const errorStatusCodes = {
		HttpError: new HttpError().statusCode,
		NotFoundError: new NotFoundError().statusCode,
		ForbiddenError: new ForbiddenError().statusCode,
		UnauthorizedError: new UnauthorizedError().statusCode,
		ValidationError: new ValidationError().statusCode,
		UnimplementedFunctionError: new UnimplementedFunctionError().statusCode,
	};

	let statusCode = errorStatusCodes[err.constructor.name] || 500;

	logger.error(err);

	const errorMessage = process.env.NODE_ENV === 'production' ? err.message : err.stack;

	if (req.tenant) {
		return res.status(statusCode).render('./error.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			error: errorMessage,
		});
	}

	return res.status(statusCode).render('error.html', { error: errorMessage });
}

export async function skipOnMyIp(req, res) {
	const myIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(', ')[0];
	return myIp == env.myIp;
}
