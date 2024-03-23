import express from 'express';
import { db } from '../database/db.js';
import { env } from '../conifg/env.js';
import { logger } from '../utils/logger.js';
import { tenantHandler } from '../app.middlewares.js';

const routes = express.Router();

routes.get('/', tenantHandler, async (req, res, next) => {
	try {
		if (req.tenant) {
			return res.status(200).render('tenant.html', { tenant: req.tenant });
		}

		const tenants = await db.select('*').from('tenants');
		return res.status(200).render('home.html', { tenants });
	} catch (error) {
		next(error);
	}
});

routes.get('/healthz', (req, res) => {
	return res.status(200).json({ message: 'ok', date: new Date() });
});

routes.get('/login', tenantHandler, async (req, res, next) => {
	try {
		return res.status(200).render('login.html');
	} catch (error) {
		next(error);
	}
});

routes.post('/login', tenantHandler, async (req, res, next) => {
	try {
		// login
	} catch (error) {
		next(error);
	}
});

routes.get('/regiser', tenantHandler, async (req, res, next) => {
	try {
		return res.status(200).render('register.html');
	} catch (error) {
		next(error);
	}
});

routes.post('/regiser', tenantHandler, async (req, res, next) => {
	try {
		// regiser
	} catch (error) {
		next(error);
	}
});

export default routes;
