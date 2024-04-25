import { NotFoundError } from '../../app.error.js';

export function getAllTenantHandler(tenantService) {
	return async (req, res) => {
		if (req.tenant) {
			throw new NotFoundError();
		}

		const tenants = await tenantService.getAllTenant({ cache: true });
		return res.status(200).json({
			message: 'ok',
			data: tenants,
		});
	};
}

export function getTenantHandler(tenantService) {
	return async (req, res) => {
		if (req.tenant) {
			throw new NotFoundError();
		}

		const tenants = await tenantService.getTenant({ tenantId: req.params.id, cache: true });
		return res.status(200).json({
			message: 'ok',
			data: tenants,
		});
	};
}
