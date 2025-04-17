import { IUser, TypeUserForm } from '@/types/auth.types';



import { axiosWithAuth } from '@/api/interceptors';


class ProductsService {
	private BASE_URL = '/products.php'

	async getProducts() {
		const response = await axiosWithAuth.get(
			`${this.BASE_URL}}`
		)
		return response.data
	}
}

export const productsService = new ProductsService()
