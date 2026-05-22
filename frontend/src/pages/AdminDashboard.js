import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Music,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  Eye,
  X,
  Save,
  Package,
  Clock,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import { api } from '../lib/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminUser, setAdminUser] = useState('');
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Data States
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [shows, setShows] = useState([]);
  const [releases, setReleases] = useState([]);
  const [about, setAbout] = useState({ name: '', photo_url: '', description: '', mission: '' });
  const [shippingSettings, setShippingSettings] = useState({ origin_cep: '', base_fee_pac: 0, base_fee_sedex: 0, additional_item_fee: 0 });
  const [socialForm, setSocialForm] = useState({ instagram_url: '', youtube_url: '', spotify_url: '', tiktok_url: '' });

  // Modal / Editing States
  const [editingItem, setEditingItem] = useState(null); // { type: 'product'|'show'|'release', data: ... }
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [trackingCode, setTrackingCode] = useState('');
  
  // Form input states
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', image_url: '', category: '', stock: 0, featured: false });
  const [showForm, setShowForm] = useState({ date: '', city: '', state: '', venue: '', event_name: '', time: '' });
  const [releaseForm, setReleaseForm] = useState({ title: '', description: '', cover_url: '', spotify_url: '', youtube_url: '', release_date: '', featured: false });

  // Authenticate Admin on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const username = localStorage.getItem('admin_username');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    setAdminUser(username || 'Administrador');
    
    // Fetch initial dashboard data
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Call standard endpoints
      const fetchedOrders = await api.get('/orders');
      const fetchedProducts = await api.get('/products');
      const fetchedShows = await api.get('/shows');
      const fetchedReleases = await api.get('/releases');
      const fetchedAbout = await api.get('/about');
      const fetchedShipping = await api.get('/shipping/settings');
      const fetchedSocial = await api.get('/settings/social');

      setOrders(fetchedOrders || []);
      setProducts(fetchedProducts || []);
      setShows(fetchedShows || []);
      setReleases(fetchedReleases || []);
      if (fetchedAbout) setAbout(fetchedAbout);
      if (fetchedShipping) setShippingSettings(fetchedShipping);
      if (fetchedSocial) setSocialForm(fetchedSocial);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados do painel. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (err) {
      console.warn('Erro ao chamar logout API:', err);
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    navigate('/admin/login');
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // --- ACTIONS FOR ORDERS ---
  const handleUpdateOrderStatus = async (orderId, newStatus, trackCode = null) => {
    try {
      const payload = { status: newStatus };
      if (trackCode !== null) {
        payload.tracking_code = trackCode;
      }
      const updated = await api.patch(`/orders/${orderId}/status`, payload);
      
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updated } : o));
      if (viewingOrder && viewingOrder.id === orderId) {
        setViewingOrder(prev => ({ ...prev, ...updated }));
      }
      setTrackingCode('');
    } catch (err) {
      alert(`Erro ao atualizar pedido: ${err.message}`);
    }
  };

  // --- CRUD ACTIONS FOR PRODUCTS ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      };

      if (editingItem) {
        const updated = await api.patch(`/products/${editingItem.id}`, payload);
        setProducts(prev => prev.map(p => p.id === editingItem.id ? updated : p));
      } else {
        const created = await api.post('/products', payload);
        setProducts(prev => [...prev, created]);
      }
      closeForms();
    } catch (err) {
      alert(`Erro ao salvar produto: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Tem certeza que deseja remover este produto?')) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      alert(`Erro ao deletar produto: ${err.message}`);
    }
  };

  // --- CRUD ACTIONS FOR SHOWS ---
  const handleSaveShow = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const updated = await api.patch(`/shows/${editingItem.id}`, showForm);
        setShows(prev => prev.map(s => s.id === editingItem.id ? updated : s));
      } else {
        const created = await api.post('/shows', showForm);
        setShows(prev => [...prev, created]);
      }
      closeForms();
    } catch (err) {
      alert(`Erro ao salvar show: ${err.message}`);
    }
  };

  const handleDeleteShow = async (showId) => {
    if (!window.confirm('Tem certeza que deseja remover este show da agenda?')) return;
    try {
      await api.delete(`/shows/${showId}`);
      setShows(prev => prev.filter(s => s.id !== showId));
    } catch (err) {
      alert(`Erro ao deletar show: ${err.message}`);
    }
  };

  // --- CRUD ACTIONS FOR RELEASES ---
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSaveRelease = async (e) => {
    e.preventDefault();
    try {
      let finalCoverUrl = releaseForm.cover_url;
      if (!finalCoverUrl && releaseForm.youtube_url) {
        const videoId = getYouTubeVideoId(releaseForm.youtube_url);
        if (videoId) {
          finalCoverUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }

      if (!finalCoverUrl) {
        alert('Por favor, informe a URL da capa ou insira um link do YouTube válido.');
        return;
      }

      const payload = {
        ...releaseForm,
        cover_url: finalCoverUrl,
        spotify_url: releaseForm.spotify_url || null,
        youtube_url: releaseForm.youtube_url || null
      };

      if (editingItem) {
        const updated = await api.patch(`/releases/${editingItem.id}`, payload);
        setReleases(prev => prev.map(r => r.id === editingItem.id ? updated : r));
      } else {
        const created = await api.post('/releases', payload);
        setReleases(prev => [...prev, created]);
      }
      closeForms();
    } catch (err) {
      alert(`Erro ao salvar lançamento: ${err.message}`);
    }
  };

  const handleDeleteRelease = async (releaseId) => {
    if (!window.confirm('Tem certeza que deseja remover este lançamento?')) return;
    try {
      await api.delete(`/releases/${releaseId}`);
      setReleases(prev => prev.filter(r => r.id !== releaseId));
    } catch (err) {
      alert(`Erro ao deletar lançamento: ${err.message}`);
    }
  };

  // --- ABOUT PROFILE AND SHIPPING SETTINGS SAVING ---
  const handleSaveAbout = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.patch('/about', about);
      setAbout(updated);
      alert('Perfil da artista atualizado com sucesso!');
    } catch (err) {
      alert(`Erro ao atualizar perfil: ${err.message}`);
    }
  };

  const handleSaveShippingSettings = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        origin_cep: shippingSettings.origin_cep,
        base_fee_pac: parseFloat(shippingSettings.base_fee_pac),
        base_fee_sedex: parseFloat(shippingSettings.base_fee_sedex),
        additional_item_fee: parseFloat(shippingSettings.additional_item_fee)
      };
      const updated = await api.patch('/shipping/settings', payload);
      setShippingSettings(updated);
      alert('Configurações de frete atualizadas com sucesso!');
    } catch (err) {
      alert(`Erro ao atualizar frete: ${err.message}`);
    }
  };

  const handleSaveSocialLinks = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.patch('/settings/social', socialForm);
      setSocialForm(updated);
      alert('Links de redes sociais atualizados com sucesso!');
    } catch (err) {
      alert(`Erro ao atualizar redes sociais: ${err.message}`);
    }
  };

  const closeForms = () => {
    setEditingItem(null);
    setIsAddingNew(false);
    setProductForm({ name: '', description: '', price: '', image_url: '', category: '', stock: 0, featured: false });
    setShowForm({ date: '', city: '', state: '', venue: '', event_name: '', time: '' });
    setReleaseForm({ title: '', description: '', cover_url: '', spotify_url: '', youtube_url: '', release_date: '', featured: false });
  };

  const openEditProduct = (prod) => {
    setEditingItem(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      image_url: prod.image_url,
      category: prod.category,
      stock: prod.stock,
      featured: prod.featured || false
    });
    setIsAddingNew(true);
  };

  const openEditShow = (show) => {
    setEditingItem(show);
    setShowForm({
      date: show.date,
      city: show.city,
      state: show.state,
      venue: show.venue,
      event_name: show.event_name,
      time: show.time || ''
    });
    setIsAddingNew(true);
  };

  const openEditRelease = (rel) => {
    setEditingItem(rel);
    setReleaseForm({
      title: rel.title,
      description: rel.description,
      cover_url: rel.cover_url,
      spotify_url: rel.spotify_url || '',
      youtube_url: rel.youtube_url || '',
      release_date: rel.release_date,
      featured: rel.featured || false
    });
    setIsAddingNew(true);
  };

  const viewOrderDetails = async (order) => {
    try {
      const details = await api.get(`/orders/${order.id}`);
      setViewingOrder(details);
    } catch (err) {
      // Fallback
      setViewingOrder(order);
    }
  };

  // --- STATS COMPUTATION FOR DASHBOARD OVERVIEW ---
  const billingTotal = orders
    .filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
    .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

  const pendingShipments = orders.filter(o => o.status === 'paid').length;
  const lowStockProducts = products.filter(p => p.stock < 5);

  return (
    <div className="min-h-screen bg-[#070509] text-white flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0E0B12] border-r border-white/10 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-black tracking-widest text-white uppercase">MARIA PITA</h2>
            <span className="text-[10px] text-[#FF2E8B] uppercase tracking-wider font-bold">Admin Workspace</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
              { id: 'orders', label: 'Gerenciar Pedidos', icon: ShoppingBag, badge: orders.filter(o => o.status === 'pending' || o.status === 'paid').length },
              { id: 'products', label: 'Produtos da Loja', icon: Package },
              { id: 'shows', label: 'Agenda de Shows', icon: Calendar },
              { id: 'releases', label: 'Lançamentos', icon: Music },
              { id: 'settings', label: 'Configurações', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); closeForms(); setViewingOrder(null); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#FF2E8B] text-white shadow-[0_0_15px_rgba(255,46,139,0.3)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge > 0 && (
                    <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Logado como</p>
            <p className="text-sm font-bold text-white truncate">{adminUser}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 hover:bg-red-500/10 text-white/60 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
            title="Sair do Painel"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF2E8B]"></div>
          </div>
        ) : (
          <>
            
            {/* TAB: DASHBOARD (PANEL GERAL) */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: Faturamento */}
                  <div className="bg-[#0E0B12] border border-white/10 p-6 rounded-2xl flex items-center gap-5 shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-white/40 font-bold block">Faturamento</span>
                      <span className="text-xl font-black text-white">{formatPrice(billingTotal)}</span>
                    </div>
                  </div>

                  {/* Card 2: Pedidos Totais */}
                  <div className="bg-[#0E0B12] border border-white/10 p-6 rounded-2xl flex items-center gap-5 shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-[#FF2E8B]/10 flex items-center justify-center text-[#FF2E8B] border border-[#FF2E8B]/20">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-white/40 font-bold block">Total Pedidos</span>
                      <span className="text-2xl font-black text-white">{orders.length}</span>
                    </div>
                  </div>

                  {/* Card 3: Envio Pendente */}
                  <div className="bg-[#0E0B12] border border-white/10 p-6 rounded-2xl flex items-center gap-5 shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                      <Clock size={24} />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-white/40 font-bold block">Aguardando Envio</span>
                      <span className="text-2xl font-black text-white">{pendingShipments}</span>
                    </div>
                  </div>

                  {/* Card 4: Alertas de Estoque */}
                  <div className="bg-[#0E0B12] border border-white/10 p-6 rounded-2xl flex items-center gap-5 shadow-lg">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                      lowStockProducts.length > 0 
                        ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse'
                        : 'bg-green-500/10 text-green-500 border-green-500/20'
                    }`}>
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-white/40 font-bold block">Estoque Baixo</span>
                      <span className="text-2xl font-black text-white">{lowStockProducts.length} itens</span>
                    </div>
                  </div>
                </div>

                {/* Main Dashboard Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Recent Orders */}
                  <div className="bg-[#0E0B12] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <h3 className="text-base font-bold uppercase tracking-wider text-white">Pedidos Recentes</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-[#FF2E8B] uppercase tracking-wider hover:underline">Ver Todos</button>
                    </div>
                    <div className="divide-y divide-white/5 space-y-4">
                      {orders.slice(0, 5).map((ord) => (
                        <div key={ord.id} className="flex justify-between items-center pt-4 first:pt-0">
                          <div>
                            <p className="font-semibold text-sm text-white">{ord.customer_name}</p>
                            <p className="text-xs text-white/40">#{ord.id.substring(0, 8).toUpperCase()} • {new Date(ord.created_at || Date.now()).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm text-white">{formatPrice(ord.total_amount)}</p>
                            <span className={`inline-block text-[9px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-full ${
                              ord.status === 'pending'
                                ? 'bg-yellow-500/10 text-yellow-500'
                                : ord.status === 'paid'
                                ? 'bg-green-500/10 text-green-500'
                                : ord.status === 'shipped'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-white/10 text-white/60'
                            }`}>
                              {ord.status === 'pending' ? 'Pendente' : ord.status === 'paid' ? 'Pago' : ord.status === 'shipped' ? 'Enviado' : 'Entregue'}
                            </span>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && <p className="text-sm text-white/40 text-center py-4">Nenhum pedido cadastrado.</p>}
                    </div>
                  </div>

                  {/* Right: Stock Warning & Quick Actions */}
                  <div className="space-y-6">
                    {/* Stock Alert Box */}
                    {lowStockProducts.length > 0 && (
                      <div className="bg-[#0E0B12] border border-red-500/20 rounded-2xl p-6 shadow-xl space-y-4">
                        <h3 className="text-base font-bold uppercase tracking-wider text-red-500 flex items-center gap-2">
                          <AlertTriangle size={18} /> Atenção ao Estoque
                        </h3>
                        <div className="space-y-2">
                          {lowStockProducts.map(p => (
                            <div key={p.id} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                              <span className="text-sm font-semibold truncate max-w-[200px]">{p.name}</span>
                              <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2.5 py-1 rounded-lg">Restam {p.stock} un</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick System Status */}
                    <div className="bg-[#0E0B12] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                      <h3 className="text-base font-bold uppercase tracking-wider text-white">Status do Sistema</h3>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                          <span className="text-2xl font-black text-white">{products.length}</span>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Produtos Ativos</p>
                        </div>
                        <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                          <span className="text-2xl font-black text-white">{shows.length}</span>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Shows Agendados</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ORDERS (GERENCIAR PEDIDOS) */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-white">Gerenciamento de Pedidos</h2>
                </div>

                {viewingOrder ? (
                  /* Order Detail Sub-view */
                  <div className="bg-[#0E0B12] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <div>
                        <button
                          onClick={() => setViewingOrder(null)}
                          className="text-xs uppercase tracking-widest font-bold text-white/60 hover:text-white mb-2 block"
                        >
                          ← Voltar para lista
                        </button>
                        <h3 className="text-lg font-black text-white uppercase">Pedido #{viewingOrder.id.substring(0, 8).toUpperCase()}</h3>
                        <p className="text-xs text-white/40">Realizado em {new Date(viewingOrder.created_at || Date.now()).toLocaleString('pt-BR')}</p>
                      </div>
                      <span className={`text-xs uppercase tracking-widest font-extrabold px-3 py-1 rounded-full ${
                        viewingOrder.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : viewingOrder.status === 'paid'
                          ? 'bg-green-500/10 text-green-500'
                          : viewingOrder.status === 'shipped'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-white/10 text-white/60'
                      }`}>
                        {viewingOrder.status === 'pending' ? 'Pendente' : viewingOrder.status === 'paid' ? 'Pago' : viewingOrder.status === 'shipped' ? 'Enviado' : 'Entregue'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      {/* Products Summary list */}
                      <div className="md:col-span-7 space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-[#FF2E8B]">Itens Comprados</h4>
                        <div className="space-y-4">
                          {viewingOrder.items && viewingOrder.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                              <div>
                                <p className="font-semibold text-sm text-white">{item.product_name}</p>
                                <p className="text-xs text-white/40">Quantidade: {item.quantity}</p>
                              </div>
                              <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Values summary */}
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-sm space-y-2">
                          <div className="flex justify-between text-white/60">
                            <span>Subtotal</span>
                            <span>{formatPrice(parseFloat(viewingOrder.total_amount) - parseFloat(viewingOrder.shipping_cost))}</span>
                          </div>
                          <div className="flex justify-between text-white/60">
                            <span>Frete ({viewingOrder.shipping_method})</span>
                            <span>{formatPrice(viewingOrder.shipping_cost)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-white pt-2 border-t border-white/5 text-base">
                            <span>Total</span>
                            <span className="text-[#FF2E8B]">{formatPrice(viewingOrder.total_amount)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Address Details & Fulfillment controls */}
                      <div className="md:col-span-5 space-y-6 border-t md:border-t-0 md:border-l border-white/10 md:pl-8">
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-[#FF2E8B] mb-3">Cliente</h4>
                          <p className="text-sm font-semibold text-white">{viewingOrder.customer_name}</p>
                          <p className="text-xs text-white/60 mt-1">{viewingOrder.customer_email}</p>
                          <p className="text-xs text-white/60">{viewingOrder.customer_phone}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-[#FF2E8B] mb-3">Destinatário</h4>
                          <p className="text-xs text-white/80 leading-relaxed">
                            {viewingOrder.address}, {viewingOrder.number} {viewingOrder.complement && `(${viewingOrder.complement})`}
                          </p>
                          <p className="text-xs text-white/60">{viewingOrder.neighborhood}</p>
                          <p className="text-xs text-white/60">{viewingOrder.city} - {viewingOrder.state}</p>
                          <p className="text-xs text-white/60 font-mono mt-1">CEP: {viewingOrder.cep}</p>
                        </div>

                        {/* Actions Box */}
                        <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-white/70 block">Ações de Entrega</h4>
                          
                          <div className="flex flex-wrap gap-2">
                            {viewingOrder.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(viewingOrder.id, 'paid')}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                              >
                                Confirmar Pagamento
                              </button>
                            )}
                            {viewingOrder.status === 'paid' && (
                              <div className="w-full space-y-3">
                                <label className="text-[10px] uppercase tracking-widest text-white/50 block">Inserir Código de Rastreio (Correios)</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={trackingCode}
                                    onChange={(e) => setTrackingCode(e.target.value)}
                                    placeholder="Ex: AA123456789BR"
                                    className="flex-1 px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white text-xs uppercase"
                                  />
                                  <button
                                    onClick={() => handleUpdateOrderStatus(viewingOrder.id, 'shipped', trackingCode)}
                                    disabled={!trackingCode}
                                    className="px-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase cursor-pointer"
                                  >
                                    Enviar
                                  </button>
                                </div>
                              </div>
                            )}
                            {viewingOrder.status === 'shipped' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(viewingOrder.id, 'delivered')}
                                className="px-4 py-2 bg-white text-black hover:bg-[#FF2E8B] hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                              >
                                Marcar como Entregue
                              </button>
                            )}
                          </div>

                          {/* Tracking Link representation */}
                          {viewingOrder.tracking_code && (
                            <div className="pt-2 border-t border-white/5">
                              <span className="text-[10px] uppercase tracking-widest text-white/50 block">Rastreamento</span>
                              <p className="text-xs font-mono font-bold text-white uppercase mt-0.5">{viewingOrder.tracking_code}</p>
                              <a
                                href={`https://rastreamento.correios.com.br/app/index.php?codigo=${viewingOrder.tracking_code}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-[#FF2E8B] hover:underline flex items-center gap-1 mt-1 font-semibold"
                              >
                                <span>Acompanhar nos Correios</span>
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Orders Table List */
                  <div className="bg-[#0E0B12] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-black/20 text-white/50 text-[10px] uppercase tracking-widest font-extrabold">
                            <th className="p-4">Pedido ID</th>
                            <th className="p-4">Data</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4 text-right">Total</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                          {orders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-mono font-bold">#{ord.id.substring(0, 8).toUpperCase()}</td>
                              <td className="p-4 text-white/60">{new Date(ord.created_at || Date.now()).toLocaleDateString('pt-BR')}</td>
                              <td className="p-4">
                                <p className="font-semibold text-white">{ord.customer_name}</p>
                                <p className="text-xs text-white/40">{ord.customer_phone}</p>
                              </td>
                              <td className="p-4 text-right font-bold">{formatPrice(ord.total_amount)}</td>
                              <td className="p-4 text-center">
                                <span className={`inline-block text-[9px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-full ${
                                  ord.status === 'pending'
                                    ? 'bg-yellow-500/10 text-yellow-500'
                                    : ord.status === 'paid'
                                    ? 'bg-green-500/10 text-green-500'
                                    : ord.status === 'shipped'
                                    ? 'bg-blue-500/10 text-blue-500'
                                    : 'bg-white/10 text-white/60'
                                }`}>
                                  {ord.status === 'pending' ? 'Pendente' : ord.status === 'paid' ? 'Pago' : ord.status === 'shipped' ? 'Enviado' : 'Entregue'}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => viewOrderDetails(ord)}
                                  className="p-2 hover:bg-[#FF2E8B]/10 hover:text-[#FF2E8B] rounded-lg transition-colors cursor-pointer"
                                  title="Ver Detalhes"
                                >
                                  <Eye size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {orders.length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-white/40">
                                Nenhum pedido encontrado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: PRODUCTS (PRODUTOS DA LOJA) */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-white">Produtos da Loja</h2>
                  {!isAddingNew && (
                    <button
                      onClick={() => { closeForms(); setIsAddingNew(true); }}
                      className="px-4 py-2.5 bg-[#FF2E8B] hover:bg-[#FF2E8B]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(255,46,139,0.2)]"
                    >
                      <Plus size={16} />
                      <span>Novo Produto</span>
                    </button>
                  )}
                </div>

                {isAddingNew ? (
                  /* Add / Edit Product Form */
                  <div className="bg-[#0E0B12] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                        {editingItem ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                      </h3>
                      <button onClick={closeForms} className="p-1 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white cursor-pointer">
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Nome do Produto</label>
                          <input
                            type="text"
                            required
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                            placeholder="Ex: Camiseta Oficial Preta"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Categoria</label>
                          <input
                            type="text"
                            required
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                            placeholder="Ex: Camisetas, CDs, Kits"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Preço (R$)</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                            placeholder="49.90"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Estoque Inicial</label>
                          <input
                            type="number"
                            required
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                            placeholder="50"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">URL da Imagem</label>
                        <input
                          type="url"
                          required
                          value={productForm.image_url}
                          onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                          placeholder="https://exemplo.com/imagem.jpg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Descrição do Produto</label>
                        <textarea
                          required
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] resize-none"
                          placeholder="Fale um pouco sobre o produto..."
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="prod-featured"
                          checked={productForm.featured}
                          onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                          className="accent-[#FF2E8B] w-4 h-4 rounded"
                        />
                        <label htmlFor="prod-featured" className="text-xs uppercase tracking-widest text-white/80 select-none cursor-pointer">
                          Destacar na Página Inicial
                        </label>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-[#FF2E8B] hover:bg-[#FF2E8B]/90 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
                        >
                          Salvar Alterações
                        </button>
                        <button
                          type="button"
                          onClick={closeForms}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Products Table List */
                  <div className="bg-[#0E0B12] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-black/20 text-white/50 text-[10px] uppercase tracking-widest font-extrabold">
                            <th className="p-4">Imagem</th>
                            <th className="p-4">Produto</th>
                            <th className="p-4">Categoria</th>
                            <th className="p-4 text-right">Preço</th>
                            <th className="p-4 text-center">Estoque</th>
                            <th className="p-4 text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                          {products.map((prod) => (
                            <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                <img src={prod.image_url} alt={prod.name} className="w-12 h-12 object-cover rounded-lg bg-black border border-white/10" />
                              </td>
                              <td className="p-4">
                                <p className="font-semibold text-white">{prod.name}</p>
                                {prod.featured && <span className="text-[9px] bg-[#FF2E8B]/10 text-[#FF2E8B] font-bold px-1.5 py-0.5 rounded border border-[#FF2E8B]/20 uppercase">Destaque</span>}
                              </td>
                              <td className="p-4 text-white/60">{prod.category}</td>
                              <td className="p-4 text-right font-bold">{formatPrice(prod.price)}</td>
                              <td className="p-4 text-center">
                                <span className={`font-bold ${prod.stock < 5 ? 'text-red-400' : 'text-white'}`}>{prod.stock} un</span>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => openEditProduct(prod)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
                                    title="Editar"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg text-white/60 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Excluir"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {products.length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-white/40">
                                Nenhum produto cadastrado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SHOWS (AGENDA DE SHOWS) */}
            {activeTab === 'shows' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-white">Agenda de Shows</h2>
                  {!isAddingNew && (
                    <button
                      onClick={() => { closeForms(); setIsAddingNew(true); }}
                      className="px-4 py-2.5 bg-[#FF2E8B] hover:bg-[#FF2E8B]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(255,46,139,0.2)]"
                    >
                      <Plus size={16} />
                      <span>Novo Show</span>
                    </button>
                  )}
                </div>

                {isAddingNew ? (
                  /* Add / Edit Show Form */
                  <div className="bg-[#0E0B12] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                        {editingItem ? 'Editar Show' : 'Adicionar Novo Show'}
                      </h3>
                      <button onClick={closeForms} className="p-1 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white cursor-pointer">
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveShow} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Nome do Evento</label>
                          <input
                            type="text"
                            required
                            value={showForm.event_name}
                            onChange={(e) => setShowForm({ ...showForm, event_name: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                            placeholder="Ex: Noite de Adoração"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Local (Venue)</label>
                          <input
                            type="text"
                            required
                            value={showForm.venue}
                            onChange={(e) => setShowForm({ ...showForm, venue: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                            placeholder="Ex: Catedral do Louvor"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Data</label>
                          <input
                            type="date"
                            required
                            value={showForm.date}
                            onChange={(e) => setShowForm({ ...showForm, date: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Horário (Opcional)</label>
                          <input
                            type="text"
                            value={showForm.time}
                            onChange={(e) => setShowForm({ ...showForm, time: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                            placeholder="20:00"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2 space-y-1">
                            <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Cidade</label>
                            <input
                              type="text"
                              required
                              value={showForm.city}
                              onChange={(e) => setShowForm({ ...showForm, city: e.target.value })}
                              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                              placeholder="Rio"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">UF</label>
                            <input
                              type="text"
                              required
                              maxLength={2}
                              value={showForm.state}
                              onChange={(e) => setShowForm({ ...showForm, state: e.target.value })}
                              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] uppercase"
                              placeholder="RJ"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-[#FF2E8B] hover:bg-[#FF2E8B]/90 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
                        >
                          Salvar Show
                        </button>
                        <button
                          type="button"
                          onClick={closeForms}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Shows Table List */
                  <div className="bg-[#0E0B12] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-black/20 text-white/50 text-[10px] uppercase tracking-widest font-extrabold">
                            <th className="p-4">Data</th>
                            <th className="p-4">Evento</th>
                            <th className="p-4">Cidade / UF</th>
                            <th className="p-4">Local</th>
                            <th className="p-4 text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                          {shows.map((show) => (
                            <tr key={show.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-mono text-white/60">
                                {new Date(show.date).toLocaleDateString('pt-BR')} {show.time && `• ${show.time}`}
                              </td>
                              <td className="p-4 font-semibold text-white">{show.event_name}</td>
                              <td className="p-4 text-white/80">{show.city} - {show.state}</td>
                              <td className="p-4 text-white/60">{show.venue}</td>
                              <td className="p-4 text-center">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => openEditShow(show)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
                                    title="Editar"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteShow(show.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg text-white/60 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Excluir"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {shows.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-white/40">
                                Nenhum show agendado na lista.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: RELEASES (LANÇAMENTOS) */}
            {activeTab === 'releases' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-white">Lançamentos Musicais</h2>
                  {!isAddingNew && (
                    <button
                      onClick={() => { closeForms(); setIsAddingNew(true); }}
                      className="px-4 py-2.5 bg-[#FF2E8B] hover:bg-[#FF2E8B]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(255,46,139,0.2)]"
                    >
                      <Plus size={16} />
                      <span>Novo Lançamento</span>
                    </button>
                  )}
                </div>

                {isAddingNew ? (
                  /* Add / Edit Release Form */
                  <div className="bg-[#0E0B12] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                        {editingItem ? 'Editar Lançamento' : 'Novo Lançamento'}
                      </h3>
                      <button onClick={closeForms} className="p-1 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white cursor-pointer">
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveRelease} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Título do Lançamento</label>
                          <input
                            type="text"
                            required
                            value={releaseForm.title}
                            onChange={(e) => setReleaseForm({ ...releaseForm, title: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                            placeholder="Ex: Sou Teu Pai (feat. Eli Soares)"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Data de Lançamento</label>
                          <input
                            type="date"
                            required
                            value={releaseForm.release_date}
                            onChange={(e) => setReleaseForm({ ...releaseForm, release_date: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">URL da Capa (Opcional se inserir link do YouTube)</label>
                        <input
                          type="url"
                          value={releaseForm.cover_url}
                          onChange={(e) => setReleaseForm({ ...releaseForm, cover_url: e.target.value })}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                          placeholder="https://img.youtube.com/vi/mb7rskqf1A4/maxresdefault.jpg"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Spotify Link (Opcional)</label>
                          <input
                            type="url"
                            value={releaseForm.spotify_url}
                            onChange={(e) => setReleaseForm({ ...releaseForm, spotify_url: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                            placeholder="https://open.spotify.com/album/..."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">YouTube Link (Opcional)</label>
                          <input
                            type="url"
                            value={releaseForm.youtube_url}
                            onChange={(e) => setReleaseForm({ ...releaseForm, youtube_url: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Descrição / Detalhes</label>
                        <textarea
                          required
                          value={releaseForm.description}
                          onChange={(e) => setReleaseForm({ ...releaseForm, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] resize-none"
                          placeholder="Sobre o videoclipe ou single..."
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="rel-featured"
                          checked={releaseForm.featured}
                          onChange={(e) => setReleaseForm({ ...releaseForm, featured: e.target.checked })}
                          className="accent-[#FF2E8B] w-4 h-4 rounded"
                        />
                        <label htmlFor="rel-featured" className="text-xs uppercase tracking-widest text-white/80 select-none cursor-pointer">
                          Destacar Lançamento
                        </label>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-[#FF2E8B] hover:bg-[#FF2E8B]/90 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
                        >
                          Salvar Lançamento
                        </button>
                        <button
                          type="button"
                          onClick={closeForms}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Releases Table List */
                  <div className="bg-[#0E0B12] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-black/20 text-white/50 text-[10px] uppercase tracking-widest font-extrabold">
                            <th className="p-4">Capa</th>
                            <th className="p-4">Título</th>
                            <th className="p-4">Data Lançamento</th>
                            <th className="p-4">Links</th>
                            <th className="p-4 text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                          {releases.map((rel) => (
                            <tr key={rel.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                <img src={rel.cover_url} alt={rel.title} className="w-16 h-10 object-cover rounded-lg bg-black border border-white/10" />
                              </td>
                              <td className="p-4">
                                <p className="font-semibold text-white">{rel.title}</p>
                                {rel.featured && <span className="text-[9px] bg-[#FF2E8B]/10 text-[#FF2E8B] font-bold px-1.5 py-0.5 rounded border border-[#FF2E8B]/20 uppercase">Destaque</span>}
                              </td>
                              <td className="p-4 text-white/60">{new Date(rel.release_date).toLocaleDateString('pt-BR')}</td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  {rel.spotify_url && <a href={rel.spotify_url} target="_blank" rel="noreferrer" className="text-green-500 text-xs hover:underline">Spotify</a>}
                                  {rel.youtube_url && <a href={rel.youtube_url} target="_blank" rel="noreferrer" className="text-red-500 text-xs hover:underline">YouTube</a>}
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => openEditRelease(rel)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
                                    title="Editar"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRelease(rel.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg text-white/60 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Excluir"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {releases.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-white/40">
                                Nenhum lançamento musical cadastrado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SETTINGS (CONFIGURAÇÕES E PERFIL) */}
            {activeTab === 'settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Profile Edit Card */}
                <div className="lg:col-span-7 bg-[#0E0B12] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                  <h3 className="text-lg font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3">Perfil da Artista (Bio)</h3>
                  
                  <form onSubmit={handleSaveAbout} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Nome de Exibição</label>
                      <input
                        type="text"
                        required
                        value={about.name}
                        onChange={(e) => setAbout({ ...about, name: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">URL da Foto de Perfil</label>
                      <input
                        type="url"
                        required
                        value={about.photo_url}
                        onChange={(e) => setAbout({ ...about, photo_url: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Missão / Chamado</label>
                      <input
                        type="text"
                        required
                        value={about.mission}
                        onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                        placeholder="Ex: Usar o dom da música para glorificar..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Biografia Completa</label>
                      <textarea
                        required
                        value={about.description}
                        onChange={(e) => setAbout({ ...about, description: e.target.value })}
                        rows={8}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#FF2E8B] hover:bg-[#FF2E8B]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(255,46,139,0.2)]"
                    >
                      <Save size={16} />
                      <span>Salvar Perfil</span>
                    </button>
                  </form>
                </div>

                {/* Column for Shipping and Social Settings */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                  {/* Shipping Settings Card */}
                  <div className="bg-[#0E0B12] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                    <h3 className="text-lg font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3">Regras de Frete (ViaCEP)</h3>
                    
                    <form onSubmit={handleSaveShippingSettings} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">CEP de Origem</label>
                        <input
                          type="text"
                          required
                          value={shippingSettings.origin_cep}
                          onChange={(e) => setShippingSettings({ ...shippingSettings, origin_cep: e.target.value })}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B] font-mono"
                          placeholder="01001-000"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">PAC Base (R$)</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={shippingSettings.base_fee_pac}
                            onChange={(e) => setShippingSettings({ ...shippingSettings, base_fee_pac: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">SEDEX Base (R$)</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={shippingSettings.base_fee_sedex}
                            onChange={(e) => setShippingSettings({ ...shippingSettings, base_fee_sedex: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Adicional por item extra (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={shippingSettings.additional_item_fee}
                          onChange={(e) => setShippingSettings({ ...shippingSettings, additional_item_fee: e.target.value })}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                        />
                      </div>

                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-xs text-white/60 leading-relaxed space-y-1">
                        <p className="font-bold text-white uppercase">💡 Como funciona o cálculo:</p>
                        <p>• PAC/SEDEX são multiplicados de acordo com a distância do estado de destino.</p>
                        <p>• Cada produto adicional no carrinho incrementa a taxa extra informada acima.</p>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-white text-black hover:bg-[#FF2E8B] hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Save size={16} />
                        <span>Atualizar Frete</span>
                      </button>
                    </form>
                  </div>

                  {/* Social Networks settings Card */}
                  <div className="bg-[#0E0B12] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                    <h3 className="text-lg font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3">Redes Sociais</h3>
                    
                    <form onSubmit={handleSaveSocialLinks} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Instagram URL</label>
                        <input
                          type="url"
                          required
                          value={socialForm.instagram_url}
                          onChange={(e) => setSocialForm({ ...socialForm, instagram_url: e.target.value })}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                          placeholder="https://www.instagram.com/..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">YouTube URL</label>
                        <input
                          type="url"
                          required
                          value={socialForm.youtube_url}
                          onChange={(e) => setSocialForm({ ...socialForm, youtube_url: e.target.value })}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                          placeholder="https://www.youtube.com/..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">Spotify URL</label>
                        <input
                          type="url"
                          required
                          value={socialForm.spotify_url}
                          onChange={(e) => setSocialForm({ ...socialForm, spotify_url: e.target.value })}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                          placeholder="https://open.spotify.com/..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-white/50 block font-semibold">TikTok URL</label>
                        <input
                          type="url"
                          required
                          value={socialForm.tiktok_url}
                          onChange={(e) => setSocialForm({ ...socialForm, tiktok_url: e.target.value })}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF2E8B]"
                          placeholder="https://www.tiktok.com/..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-white text-black hover:bg-[#FF2E8B] hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Save size={16} />
                        <span>Salvar Redes Sociais</span>
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            )}

          </>
        )}

      </main>
    </div>
  );
}
