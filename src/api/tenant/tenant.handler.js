import { NotFoundError } from '../../app.errors.js';

export function getTenantHandler(tenantService) {
	return async (req, res) => {
		if (!req.tenant) throw new NotFoundError();

		const tenants = await tenantService.getTenant(req.tenant.id);
		return res.status(200).json({
			message: 'ok',
			data: tenants,
		});
	};
}