import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import express from 'express';
import { db, redis } from '../database/db.js';
import { sendContactEmail } from '../emails/email.js';
import {
	tenantIdentityHandler,
	catchAsyncErrorHandler,
	authenticationHandler,
	csrfHandler,
	// validateRequestHandler,
} from '../app.middlewares.js';
import { oauth as oauthRouter } from '../oauth/oauth.router.js';
import {
	getContactHandler,
	postContactHandler,
	getHealthzHandler,
	getIndexHandler,
	getTenantsHandler,
	getPrivacyPolicyHandler,
	getTenantsNewHandler,
	getTermsOfServiceHandler,
	getLoginHandler,
	getLogoutHandler,
	postReviewHandler,
} from './web.handler.js';
import { WebRepository } from './web.repository.js';
import { TenantService } from '../api/tenant/tenant.service.js';
import { SearchService } from '../api/search/search.service.js';
// import { body } from 'express-validator';

dayjs.extend(relativeTime);

const web = express.Router();

web.use(oauthRouter);

/**
 * GET /healthz
 * @tags web
 * @summary get healthz page
 */
web.get('/healthz', getHealthzHandler());

/**
 * GET /privacy-policy
 * @tags web
 * @summary get privacy policy page
 */
web.get(
	'/privacy-policy',
	tenantIdentityHandler,
	catchAsyncErrorHandler(getPrivacyPolicyHandler()),
);

/**
 * GET /terms-of-services
 * @tags web
 * @summary get terms of services page
 */
web.get(
	'/terms-of-services',
	tenantIdentityHandler,
	catchAsyncErrorHandler(getTermsOfServiceHandler()),
);

/**
 * GET /login
 * @tags auth
 * @summary get login url
 */
web.get('/login', tenantIdentityHandler, catchAsyncErrorHandler(getLoginHandler()));

/**
 * GET /logout
 * @tags auth
 * @summary get logout url
 */
web.get('/logout', tenantIdentityHandler, catchAsyncErrorHandler(getLogoutHandler()));

/**
 * GET /contact
 * @tags contact
 * @summary get contact page
 */
web.get(
	'/contact',
	tenantIdentityHandler,
	csrfHandler,
	catchAsyncErrorHandler(getContactHandler()),
);

/**
 * POST /contact
 * @tags contact
 * @summary post contact
 */
web.post(
	'/contact',
	tenantIdentityHandler,
	csrfHandler,
	catchAsyncErrorHandler(postContactHandler(sendContactEmail)),
);

/**
 * GET /tenants
 * @tags tenants
 * @summary get tenants page
 */
web.get('/tenants', catchAsyncErrorHandler(getTenantsHandler(SearchService(db, redis))));

/**
 * GET /tenants/create
 * @tags tenants
 * @summary get tenants create page
 */
web.get('/tenants/create', authenticationHandler, catchAsyncErrorHandler(getTenantsNewHandler()));

/**
 * GET <subdomain>/
 * @tags <subdomain>/reviews
 * @summary get tenant reviews page
 */

/**
 * GET /
 * @tags web
 * @summary get index page
 */
web.get(
	'/',
	tenantIdentityHandler,
	csrfHandler,
	catchAsyncErrorHandler(getIndexHandler(WebRepository(db), TenantService(db, redis, dayjs))),
);

/**
 * POST <subdomain>/reviews
 * @tags <subdomain>/reviews
 * @summary post <subdomain>/reviews
 */
web.post(
	'/reviews',
	authenticationHandler,
	tenantIdentityHandler,
	csrfHandler,
	catchAsyncErrorHandler(postReviewHandler(TenantService(db, redis))),
);

export { web };
