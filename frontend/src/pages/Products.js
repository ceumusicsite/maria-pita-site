import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { ShoppingBag } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const endpoint = selectedCategory === 'all' 
          ? '/products' 
          : `/products?category=${selectedCategory}`;
        const data = await api.get(endpoint);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const categories = ['all', 'CDs', 'Camisetas', 'Pôsteres', 'Kits', 'Acessórios'];

  return (
    <main className="pt-32 pb-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">
            Loja <span className="text-gradient">Oficial</span>
          </h1>
          <p className="text-text-secondary text-lg mb-8">
            Produtos exclusivos para você levar um pedaço da experiência Maria Pita
          </p>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-white/10 text-text-secondary hover:border-primary/50'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center text-text-secondary py-20">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card className="group cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300">
                  <div className="relative aspect-square overflow-hidden bg-surface">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
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
        )}
      </div>
    </main>
  );
}
