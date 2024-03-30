import express from 'express';
import { db } from '../database/db.js';
import { tenantIdentityHandler, catchAsyncErrorHandler } from '../app.middlewares.js';
import { NotFoundError, UnimplementedFunctionError } from '../app.errors.js';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '../emails/email.js';

const routes = express.Router();

routes.get('/healthz', (req, res) => {
	return res.status(200).json({ message: 'ok', date: new Date() });
});

routes.get(
	'/privacy-policy',
	tenantIdentityHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (!req.tenant) {
			return res.status(200).render('privacy-policy.html');
		}

		return res.status(200).render('privacy-policy.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	}),
);

routes.get(
	'/terms-of-services',
	tenantIdentityHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (!req.tenant) {
			return res.status(200).render('terms-of-services.html');
		}

		return res.status(200).render('terms-of-services.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	}),
);

routes.get(
	'/',
	tenantIdentityHandler,
	catchAsyncErrorHandler(async (req, res) => {
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
	}),
);

routes.get(
	'/admin',
	tenantIdentityHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (!req.tenant) throw new NotFoundError();

		return res.status(200).render('admin.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	}),
);

routes.get(
	'/user/:username',
	tenantIdentityHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (!req.tenant) throw new NotFoundError();

		const user = await db
			.select('*')
			.from('users')
			.where({ tenant_id: req.tenant.id, username: req.params.username })
			.first();

		if (!user) throw new NotFoundError();

		return res.status(200).render('user.html', {
			user,
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
		});
	}),
);

routes.post(
	'/user/:id',
	tenantIdentityHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (!req.tenant) throw new NotFoundError();

		if (req.body.method === 'DELETE') {
			const user = await db
				.delete()
				.from('users')
				.where({ tenant_id: req.tenant.id, id: req.params.id });

			if (!user) throw new NotFoundError();

			return res.redirect('/admin');
		}

		throw new UnimplementedFunctionError();
	}),
);

routes.get(
	'/login',
	tenantIdentityHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (!req.tenant) throw new NotFoundError();

		return res.status(200).render('login.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			flashMessages: req.flash(),
		});
	}),
);

routes.post(
	'/login',
	tenantIdentityHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (!req.tenant) throw new NotFoundError();

		if (req.body.message === '' || req.body.email === '') {
			req.flash('error', 'username or password cannot be empty!');
			return res.redirect('/login');
		}

		const user = await db
			.select('*')
			.from('users')
			.where({ tenant_id: req.tenant.id, email: req.body.email })
			.first();

		if (!user) {
			req.flash('error', 'email or password is wrong!');
			return res.redirect('/login');
		}

		const comparedPassword = await bcrypt.compare(req.body.password, user.password);

		if (!comparedPassword) {
			req.flash('error', 'email or password is wrong!');
			return res.redirect('/login');
		}

		return res.redirect('/admin');
	}),
);

routes.get(
	'/register',
	tenantIdentityHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (!req.tenant) throw new NotFoundError();

		return res.status(200).render('register.html', {
			tenant: JSON.stringify(req.tenant),
			layout: '../layouts/tenant.html',
			flashMessages: req.flash(),
		});
	}),
);

routes.post(
	'/register',
	tenantIdentityHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (!req.tenant) throw new NotFoundError();

		if (req.body.message === '' || req.body.email === '' || req.body.username === '') {
			req.flash('error', 'username or password cannot be empty!');
			return res.redirect('/register');
		}

		const user = await db.select('*').from('users').where({ email: req.body.email }).first();

		if (user) {
			req.flash('error', 'user already exist!');
			return res.redirect('/register');
		}

		if (user && user.username === req.body.username) {
			req.flash('error', 'username already exist!');
			return res.redirect('/register');
		}

		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		await db('users').insert({
			tenant_id: req.tenant.id,
			email: req.body.email,
			username: req.body.username,
			password: hashedPassword,
		});

		// TODO: use job queue
		await sendWelcomeEmail({ email: req.body.email, username: req.body.username });

		return res.redirect('/admin');
	}),
);

export default routes;
