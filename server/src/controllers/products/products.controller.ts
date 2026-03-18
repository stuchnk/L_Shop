import { Request, Response } from 'express';
import { productService } from '../../services/products/products.service';
import { ProductQueryParams } from '../../types/product';

export const productController = {
  getAll(req: Request, res: Response): void {
    const query: ProductQueryParams = {
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as ProductQueryParams['sortBy'],
      category: req.query.category as string | undefined,
      available: req.query.available as string | undefined,
      minPrice: req.query.minPrice as string | undefined,
      maxPrice: req.query.maxPrice as string | undefined,
    };

    const products = productService.getAll(query);
    res.json(products);
  },

  getById(req: Request, res: Response): void {
    const id: number = parseInt(req.params.id, 10);
    const product = productService.getById(id);

    if (!product) {
      res.status(404).json({ error: 'Товар не найден' });
      return;
    }

    res.json(product);
  },

  getCategories(_req: Request, res: Response): void {
    const categories: string[] = productService.getCategories();
    res.json(categories);
  },
};