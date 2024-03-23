import express from 'express';
import { db } from '../database/db.js';
import { logger } from '../utils/logger.js';
import { tenantHandler } from '../app.middlewares.js';
import { NotFoundError, ValidationError } from '../app.errors.js';

const routes = express.Router();

routes.get('/healthz', (req, res) => {
	return res.status(200).json({ message: 'ok', date: new Date() });
});

routes.get('/', tenantHandler, async (req, res, next) => {
	try {
		if (req.tenant) {
			const users = await db.select('*').from('users').where({ tenant_id: req.tenant.id });
			return res.status(200).render('tenant.html', {
				tenant: JSON.stringify(req.tenant),
				layout: '../layouts/tenant.html',
				users,
			});
		}

		const tenants = await db.select('*').from('tenants');
		return res.status(200).render('home.html', { tenants });
	} catch (error) {
		next(error);
	}
});

routes.get('/admin', tenantHandler, async (req, res, next) => {
	try {
		if (req.tenant) {
			const users = await db.select('*').from('users').where({ tenant_id: req.tenant.id });
			return res.status(200).render('admin.html', {
				tenant: JSON.stringify(req.tenant),
				layout: '../layouts/tenant.html',
				users,
			});
		}
		throw new NotFoundError();
	} catch (error) {
		next(error);
	}
});

routes.get('/user/:id', tenantHandler, async (req, res, next) => {
	try {
		const user = await db
			.select('*')
			.from('users')
			.where({ tenant_id: req.tenant.id, id: req.params.id })
			.first();

		if (!user) throw new NotFoundError();

		return res.status(200).render('user.html', {
			user,
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	} catch (error) {
		next(error);
	}
});

routes.get('/login', tenantHandler, async (req, res, next) => {
	try {
		return res.status(200).render('login.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	} catch (error) {
		next(error);
	}
});

routes.post('/login', tenantHandler, async (req, res, next) => {
	try {
		const user = await db
			.select('*')
			.from('users')
			.where({ tenant_id: req.tenant.id, email: req.body.email, password: req.body.password })
			.first();

		if (!user) throw new ValidationError('email or password is wrong!');
		return res.redirect('/admin');
	} catch (error) {
		next(error);
	}
});

routes.get('/register', tenantHandler, async (req, res, next) => {
	try {
		return res.status(200).render('register.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	} catch (error) {
		next(error);
	}
});

routes.post('/register', tenantHandler, async (req, res, next) => {
	try {
		await db('users').insert({
			tenant_id: req.tenant.id,
			email: req.body.email,
			password: req.body.password,
		});
		return res.redirect('/admin');
	} catch (error) {
		next(error);
	}
});

export default routes;
