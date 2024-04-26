import express from 'express';

import { NotFoundError } from '../../app.error.js';
import { catchAsyncErrorHandler, tenantIdentityHandler } from '../../app.middleware.js';
import { db } from '../../database/db.js';

const reviews = express.Router();

reviews.get(
	'/random',
	tenantIdentityHandler,
	catchAsyncErrorHandler(async (req, res) => {
		if (req.tenant) {
			throw new NotFoundError();
		}

		const size = req.query.size || 5;

		const data = await db('reviews')
			.select('reviews.*', 'users.username')
			.join('users', 'reviews.user_id', 'users.id')
			.orderByRaw('RANDOM()')
			.limit(size);

		return res.json({ message: 'ok', data });
	}),
);

export { reviews };
