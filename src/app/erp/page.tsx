'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import './Erp.css';

interface Product {
  id: string; name: string; description: string | null; price: number;
  costPrice: number | null; stockQuantity: number; minStock: number;
  imageUrl: string | null; sku: string; barcode: string;
  category: string | null; brand: string | null; isActive: boolean; createdAt: string;
}
interface Order {
  id: string; orderNumber: string; status: string; totalAmount: number;
  paymentStatus: string; createdAt: string;
  user: { name: string | null; email: string };
  items: { quantity: number; unitPrice: number; product: { name: string } }[];
}
interface Lead {
  id: string; name: string; email: string; phone: string | null;
  message: string | null; source: string | null; status: string; createdAt: string;
}

type Tab = 'dashboard' | 'products' | 'orders' | 'leads' | 'barcode';

export default function ErpDashboard() {
  const { user, hydrated, showToast } = useAppContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [barcodeSearch, setBarcodeSearch] = useState('');
  const [barcodeResult, setBarcodeResult] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name:'',description:'',price:'',costPrice:'',stockQuantity:'',
    minStock:'5',imageUrl:'',category:'',brand:'',sku:'',barcode:''
  });

  useEffect(() => {
    if (!hydrated) return;
    if (!user || user.role !== 'admin') { router.push('/login'); return; }
    fetchAll();
  }, [user, hydrated, router]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, oRes, lRes] = await Promise.all([
        fetch('/api/products'), fetch('/api/orders'), fetch('/api/leads')
      ]);
      setProducts(await pRes.json());
      const od = await oRes.json(); setOrders(Array.isArray(od)?od:[]);
      const ld = await lRes.json(); setLeads(Array.isArray(ld)?ld:[]);
    } catch(e){ console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const res = await fetch(url, { method: editingId?'PUT':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(formData) });
      if(!res.ok) throw new Error('Failed');
      showToast('success', editingId?'Updated!':'Added!');
      setEditingId(null);
      setFormData({name:'',description:'',price:'',costPrice:'',stockQuantity:'',minStock:'5',imageUrl:'',category:'',brand:'',sku:'',barcode:''});
      await fetchAll();
    } catch { showToast('error','Save failed'); } finally { setSaving(false); }
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData({name:p.name,description:p.description||'',price:p.price.toString(),costPrice:p.costPrice?.toString()||'',
      stockQuantity:p.stockQuantity.toString(),minStock:p.minStock.toString(),imageUrl:p.imageUrl||'',
      category:p.category||'',brand:p.brand||'',sku:p.sku,barcode:p.barcode});
    setActiveTab('products');
  };

  const handleDelete = async (id: string) => {
    if(confirm('Delete this product?')){ await fetch(`/api/products/${id}`,{method:'DELETE'}); showToast('success','Deleted'); await fetchAll(); }
  };

  const printBarcode = (p: Product) => {
    const w = window.open('','_blank');
    if(w){ w.document.write(`<html><head><title>Barcode</title><style>body{font-family:monospace;text-align:center;padding:20px}.label{border:1px dashed #ccc;padding:15px;display:inline-block;margin:10px}@media print{button{display:none}}</style></head><body><button onclick="window.print()">Print</button><div class="label"><h3>${p.name}</h3><p style="font-size:24px;letter-spacing:3px">${p.barcode}</p><p>SKU: ${p.sku}</p><p>₹${p.price}</p></div></body></html>`); }
  };

  const lookupBarcode = () => {
    const f = products.find(p => p.barcode===barcodeSearch||p.sku===barcodeSearch||p.name.toLowerCase().includes(barcodeSearch.toLowerCase()));
    setBarcodeResult(f||null);
    if(!f) showToast('error','Not found');
  };

  if(!hydrated) return <div className="erp-loading"><div className="spinner"></div></div>;
  if(!user||user.role!=='admin') return <div className="erp-loading">Redirecting...</div>;

  const oos = products.filter(p=>p.stockQuantity===0);
  const low = products.filter(p=>p.stockQuantity>0&&p.stockQuantity<=p.minStock);
  const totalVal = products.reduce((s,p)=>s+p.price*p.stockQuantity,0);
  const totalRev = orders.reduce((s,o)=>s+o.totalAmount,0);

  const tabs: {id:Tab;label:string;icon:string}[] = [
    {id:'dashboard',label:'Dashboard',icon:'📊'},{id:'products',label:'Products',icon:'📦'},
    {id:'orders',label:'Orders',icon:'🧾'},{id:'leads',label:'Leads',icon:'👥'},
    {id:'barcode',label:'Barcode',icon:'🏷️'}
  ];

  return (
    <div className="erp-page">
      <aside className="erp-sidebar">
        <div className="erp-sidebar-header"><span>🐾</span><span className="erp-sidebar-title">ERP Panel</span></div>
        <nav className="erp-nav">
          {tabs.map(t=>(
            <button key={t.id} className={`erp-nav-item ${activeTab===t.id?'active':''}`} onClick={()=>setActiveTab(t.id)}>
              <span>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="erp-sidebar-footer"><span>👤 {user.name||user.email}</span></div>
      </aside>
      <main className="erp-main">
        <div className="erp-topbar">
          <h1 className="erp-page-title">{tabs.find(t=>t.id===activeTab)?.icon} {tabs.find(t=>t.id===activeTab)?.label}</h1>
          <button className="btn btn-secondary btn-sm" onClick={fetchAll} disabled={loading}>{loading?'⏳':'🔄'} Refresh</button>
        </div>

        {activeTab==='dashboard'&&(
          <div className="erp-content">
            <div className="erp-stats-grid">
              {[{l:'Products',v:products.length,i:'📦',c:'var(--secondary-color)'},{l:'Total Stock',v:products.reduce((s,p)=>s+p.stockQuantity,0),i:'📊',c:'var(--accent-green)'},
                {l:'Inventory Value',v:`₹${totalVal.toLocaleString('en-IN')}`,i:'💰',c:'var(--primary-color)'},{l:'Revenue',v:`₹${totalRev.toLocaleString('en-IN')}`,i:'💵',c:'var(--accent-green)'},
                {l:'Orders',v:orders.length,i:'🧾',c:'var(--secondary-color)'},{l:'Leads',v:leads.length,i:'👥',c:'var(--accent-purple)'},
                {l:'Out of Stock',v:oos.length,i:'⚠️',c:'var(--danger)'},{l:'Low Stock',v:low.length,i:'📉',c:'var(--warning)'}
              ].map((s,i)=>(
                <div key={i} className="erp-stat-card" style={{'--stat-color':s.c} as React.CSSProperties}>
                  <div className="erp-stat-icon">{s.i}</div><div className="erp-stat-value">{s.v}</div><div className="erp-stat-label">{s.l}</div>
                </div>
              ))}
            </div>
            {oos.length>0&&<div className="erp-alert erp-alert-danger"><strong>⚠️ Out of Stock:</strong> {oos.map(p=>p.name).join(', ')}</div>}
            {low.length>0&&<div className="erp-alert erp-alert-warning"><strong>📉 Low Stock:</strong> {low.map(p=>`${p.name} (${p.stockQuantity})`).join(', ')}</div>}
            <div className="erp-section"><h3>Recent Orders</h3>
              <div className="erp-table-wrapper"><table className="data-table"><thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>{orders.slice(0,5).map(o=>(<tr key={o.id}><td><strong>{o.orderNumber}</strong></td><td>{o.user?.name||o.user?.email}</td><td>₹{o.totalAmount.toLocaleString('en-IN')}</td>
                <td><span className={`badge badge-${o.status==='completed'?'success':'warning'}`}>{o.status}</span></td><td>{new Date(o.createdAt).toLocaleDateString()}</td></tr>))}
                {orders.length===0&&<tr><td colSpan={5} style={{textAlign:'center',padding:'2rem',color:'var(--text-muted)'}}>No orders yet</td></tr>}</tbody></table></div>
            </div>
          </div>
        )}

        {activeTab==='products'&&(
          <div className="erp-content"><div className="erp-two-col">
            <div className="erp-form-panel"><h3>{editingId?'✏️ Edit':'➕ Add'} Product</h3>
              <form onSubmit={handleSubmit}>
                <label>Name *</label><input value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} required/>
                <div className="form-row"><div className="form-group"><label>Price ₹ *</label><input type="number" step="0.01" value={formData.price} onChange={e=>setFormData({...formData,price:e.target.value})} required/></div>
                <div className="form-group"><label>Cost ₹</label><input type="number" step="0.01" value={formData.costPrice} onChange={e=>setFormData({...formData,costPrice:e.target.value})}/></div></div>
                <div className="form-row"><div className="form-group"><label>Stock *</label><input type="number" value={formData.stockQuantity} onChange={e=>setFormData({...formData,stockQuantity:e.target.value})} required/></div>
                <div className="form-group"><label>Min Stock</label><input type="number" value={formData.minStock} onChange={e=>setFormData({...formData,minStock:e.target.value})}/></div></div>
                <div className="form-row"><div className="form-group"><label>Category</label><input value={formData.category} onChange={e=>setFormData({...formData,category:e.target.value})}/></div>
                <div className="form-group"><label>Brand</label><input value={formData.brand} onChange={e=>setFormData({...formData,brand:e.target.value})}/></div></div>
                <label>Description</label><textarea rows={3} value={formData.description} onChange={e=>setFormData({...formData,description:e.target.value})}/>
                <label>Image URL</label><input value={formData.imageUrl} onChange={e=>setFormData({...formData,imageUrl:e.target.value})}/>
                <button type="submit" className="btn btn-primary" style={{width:'100%'}} disabled={saving}>{saving?'Saving...':editingId?'Update':'Add Product'}</button>
                {editingId&&<button type="button" className="btn btn-secondary" style={{width:'100%',marginTop:'0.5rem'}} onClick={()=>{setEditingId(null);setFormData({name:'',description:'',price:'',costPrice:'',stockQuantity:'',minStock:'5',imageUrl:'',category:'',brand:'',sku:'',barcode:''});}}>Cancel</button>}
              </form>
            </div>
            <div className="erp-list-panel"><h3>📦 Inventory ({products.length})</h3>
              <div className="erp-table-wrapper"><table className="data-table"><thead><tr><th>Product</th><th>SKU</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
              <tbody>{products.map(p=>(
                <tr key={p.id} className={p.stockQuantity===0?'row-danger':p.stockQuantity<=p.minStock?'row-warning':''}>
                  <td><div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>{p.imageUrl&&<img src={p.imageUrl} alt="" style={{width:32,height:32,borderRadius:6,objectFit:'cover'}}/>}<div><div style={{fontWeight:600,fontSize:'0.9rem'}}>{p.name}</div></div></div></td>
                  <td><code style={{fontSize:'0.75rem'}}>{p.sku}</code></td>
                  <td>₹{p.price.toLocaleString('en-IN')}</td>
                  <td><span className={`badge ${p.stockQuantity===0?'badge-danger':p.stockQuantity<=p.minStock?'badge-warning':'badge-success'}`}>{p.stockQuantity}</span></td>
                  <td><div style={{display:'flex',gap:'0.25rem'}}><button className="btn btn-sm btn-secondary" onClick={()=>handleEdit(p)}>✏️</button><button className="btn btn-sm btn-secondary" onClick={()=>printBarcode(p)}>🏷️</button><button className="btn btn-sm btn-danger" onClick={()=>handleDelete(p.id)}>🗑️</button></div></td>
                </tr>))}</tbody></table></div>
            </div>
          </div></div>
        )}

        {activeTab==='orders'&&(
          <div className="erp-content"><div className="erp-table-wrapper"><table className="data-table"><thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>{orders.map(o=>(<tr key={o.id}><td><strong>{o.orderNumber}</strong></td><td>{o.user?.name||o.user?.email}</td><td>{o.items?.length||0}</td><td>₹{o.totalAmount.toLocaleString('en-IN')}</td>
            <td><span className={`badge badge-${o.paymentStatus==='paid'?'success':'warning'}`}>{o.paymentStatus}</span></td>
            <td><span className={`badge badge-${o.status==='completed'?'success':'info'}`}>{o.status}</span></td><td>{new Date(o.createdAt).toLocaleDateString()}</td></tr>))}
            {orders.length===0&&<tr><td colSpan={7} style={{textAlign:'center',padding:'2rem',color:'var(--text-muted)'}}>No orders</td></tr>}</tbody></table></div></div>
        )}

        {activeTab==='leads'&&(
          <div className="erp-content"><div className="erp-table-wrapper"><table className="data-table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Source</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>{leads.map(l=>(<tr key={l.id}><td><strong>{l.name}</strong></td><td>{l.email}</td><td>{l.phone||'—'}</td>
            <td><span className="badge badge-info">{l.source}</span></td><td><span className={`badge badge-${l.status==='new'?'warning':'success'}`}>{l.status}</span></td>
            <td>{new Date(l.createdAt).toLocaleDateString()}</td></tr>))}
            {leads.length===0&&<tr><td colSpan={6} style={{textAlign:'center',padding:'2rem',color:'var(--text-muted)'}}>No leads</td></tr>}</tbody></table></div></div>
        )}

        {activeTab==='barcode'&&(
          <div className="erp-content"><div className="erp-two-col">
            <div className="erp-form-panel"><h3>🔍 Barcode Lookup</h3>
              <p style={{color:'var(--text-muted)',marginBottom:'1rem',fontSize:'0.9rem'}}>Enter barcode, SKU, or name</p>
              <div style={{display:'flex',gap:'0.5rem'}}><input value={barcodeSearch} onChange={e=>setBarcodeSearch(e.target.value)} placeholder="Scan or type..." onKeyDown={e=>e.key==='Enter'&&lookupBarcode()} style={{marginBottom:0,flex:1}}/><button className="btn btn-primary" onClick={lookupBarcode}>Search</button></div>
              {barcodeResult&&(<div className="barcode-result"><h4>{barcodeResult.name}</h4>
                <div className="barcode-result-details"><p><strong>SKU:</strong> {barcodeResult.sku}</p><p><strong>Barcode:</strong> {barcodeResult.barcode}</p><p><strong>Price:</strong> ₹{barcodeResult.price}</p><p><strong>Stock:</strong> {barcodeResult.stockQuantity}</p></div>
                <div style={{display:'flex',gap:'0.5rem',marginTop:'1rem'}}><button className="btn btn-primary btn-sm" onClick={()=>printBarcode(barcodeResult)}>🖨️ Print</button><button className="btn btn-secondary btn-sm" onClick={()=>handleEdit(barcodeResult)}>✏️ Edit</button></div>
              </div>)}
            </div>
            <div className="erp-list-panel"><h3>🏷️ All Barcodes</h3>
              <div className="barcode-list">{products.map(p=>(
                <div key={p.id} className="barcode-card" onClick={()=>printBarcode(p)}>
                  <div><strong>{p.name}</strong><br/><span style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>SKU: {p.sku} | {p.barcode}</span></div>
                  <div style={{fontWeight:700}}>₹{p.price}</div>
                </div>))}
              </div>
            </div>
          </div></div>
        )}
      </main>
    </div>
  );
}
