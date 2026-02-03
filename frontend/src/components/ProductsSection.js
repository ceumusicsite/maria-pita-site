import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { api } from '@/lib/api';
import { ShoppingBag } from 'lucide-react';

export const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get('/products?featured=true');
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-32 container mx-auto px-6 max-w-7xl">
        <div className="text-center text-text-secondary">Carregando...</div>
      </section>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <section className="py-32 container mx-auto px-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h2 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">
          Loja <span className="text-gradient">Oficial</span>
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl">
          Produtos exclusivos para você levar um pedaço da experiência Maria Pita
        </p>
      </motion.div>

      {products.length === 0 && !loading ? (
        <div className="text-center text-text-secondary py-8">
          Nenhum produto disponível no momento.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="group cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-square overflow-hidden bg-surface">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <p className="text-primary text-xs uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl font-bold text-white">
                    {formatPrice(product.price)}
                  </span>
                  <button className="bg-primary p-2 rounded-full hover:scale-110 transition-transform">
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
          </div>

          <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 text-center"
      >
            <Button variant="secondary" to="/products">
              Ver Todos os Produtos
            </Button>
          </motion.div>
        </>
      )}
    </section>
  );
};
