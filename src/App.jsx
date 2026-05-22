import { useMemo, useState } from 'react'
import './App.css'

const initialProducts = [
  { id: 1, name: 'Caneta', quantity: 25, price: 3.5 },
  { id: 2, name: 'Caderno', quantity: 48, price: 15.9 },
  { id: 3, name: 'Mochila', quantity: 12, price: 129.9 },
]

const menuItems = [
  { key: 'add', label: 'Adicionar produto' },
  { key: 'view', label: 'Ver estoque' },
  { key: 'remove', label: 'Remover produto' },
  { key: 'update', label: 'Atualizar quantidade' },
  { key: 'logout', label: 'Sair' },
]

function App() {
  const [page, setPage] = useState('landing')
  const [authMode, setAuthMode] = useState('login')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [stock, setStock] = useState(initialProducts)
  const [selectedAction, setSelectedAction] = useState('add')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' })
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', price: '' })
  const [selectedProductId, setSelectedProductId] = useState('')
  const [updateQty, setUpdateQty] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStock = useMemo(() => {
    if (!searchTerm.trim()) return stock
    return stock.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm, stock])

  const totalItems = useMemo(
    () => stock.reduce((sum, item) => sum + item.quantity, 0),
    [stock],
  )

  const totalValue = useMemo(
    () => stock.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [stock],
  )

  const formTitle = page === 'landing' ? 'Bem-vindo ao Sistema de Estoque' : authMode === 'login' ? 'Login' : 'Cadastrar conta'

  const showNotification = (message, variant = 'success') => {
    setNotification({ message, variant })
    setTimeout(() => setNotification(null), 3200)
  }

  const handleLogin = (event) => {
    event.preventDefault()
    if (!loginData.email || !loginData.password) {
      showNotification('Preencha o e-mail e a senha.', 'error')
      return
    }
    setUser({ name: loginData.email.split('@')[0] || 'Usuário', email: loginData.email })
    setPage('dashboard')
    setLoginData({ email: '', password: '' })
    setSelectedAction('add')
    showNotification('Login realizado com sucesso!')
  }

  const handleSignup = (event) => {
    event.preventDefault()
    if (!signupData.name || !signupData.email || !signupData.password) {
      showNotification('Preencha todos os campos para criar a conta.', 'error')
      return
    }
    setUser({ name: signupData.name, email: signupData.email })
    setPage('dashboard')
    setSignupData({ name: '', email: '', password: '' })
    setSelectedAction('add')
    showNotification('Conta criada com sucesso!')
  }

  const handleAddProduct = (event) => {
    event.preventDefault()
    const quantity = Number(newProduct.quantity)
    const price = Number(newProduct.price)

    if (!newProduct.name || quantity <= 0 || price <= 0) {
      showNotification('Informe nome, quantidade e preço válidos.', 'error')
      return
    }

    const exists = stock.find((item) => item.name.toLowerCase() === newProduct.name.toLowerCase())

    if (exists) {
      setStock((current) =>
        current.map((item) =>
          item.id === exists.id
            ? { ...item, quantity: item.quantity + quantity, price }
            : item,
        ),
      )
      showNotification('Quantidade atualizada para o produto existente.')
    } else {
      setStock((current) => [
        ...current,
        { id: Date.now(), name: newProduct.name, quantity, price },
      ])
      showNotification('Produto adicionado ao estoque.')
    }

    setNewProduct({ name: '', quantity: '', price: '' })
  }

  const handleRemoveProduct = () => {
    const id = Number(selectedProductId)
    if (!id) {
      showNotification('Selecione um produto para remover.', 'error')
      return
    }
    const product = stock.find((item) => item.id === id)
    if (!product) {
      showNotification('Produto não encontrado.', 'error')
      return
    }
    setStock((current) => current.filter((item) => item.id !== id))
    setSelectedProductId('')
    showNotification(`Produto ${product.name} removido do estoque.`)
  }

  const handleUpdateQuantity = () => {
    const id = Number(selectedProductId)
    const quantity = Number(updateQty)
    if (!id || quantity < 0) {
      showNotification('Selecione um produto e informe uma quantidade válida.', 'error')
      return
    }
    setStock((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    )
    const product = stock.find((item) => item.id === id)
    setUpdateQty('')
    showNotification(`Quantidade de ${product?.name ?? 'produto'} atualizada.`)
  }

  const handleLogout = () => {
    setUser(null)
    setPage('landing')
    setSelectedAction('add')
    showNotification('Você saiu do sistema.', 'success')
  }

  if (page === 'landing') {
    return (
      <div className="page page-landing">
        <header className="hero-panel">
          <div className="brand-badge">S</div>
          <div>
            <p className="eyebrow">Portfólio de projeto</p>
            <h1>Sistema de Estoque</h1>
            <p className="hero-copy">
              Controle smart de produtos, quantidades e atualizações em um painel
              leve e responsivo.
            </p>
          </div>
        </header>

        <div className="feature-grid">
          <article className="feature-card">
            <h2>Organização fácil</h2>
            <p>Adicione, remova e atualize itens com poucos cliques.</p>
          </article>
          <article className="feature-card">
            <h2>Visão clara</h2>
            <p>Veja o estoque atual, total de produtos e valor armazenado.</p>
          </article>
          <article className="feature-card">
            <h2>Notificações</h2>
            <p>Mensagens instantâneas informam cada ação no sistema.</p>
          </article>
        </div>

        <div className="landing-actions">
          <button className="primary-button" onClick={() => setPage('login')}>
            INICIAR
          </button>
          <div className="screenshot-card">
            <div className="screenshot-tag">Telas</div>
            <p>Login, cadastro e painel com menu de ações.</p>
          </div>
        </div>
      </div>
    )
  }

  if (page === 'dashboard' && user) {
    return (
      <div className="page page-dashboard">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Painel do sistema</p>
            <h1>Bem-vindo, {user.name}</h1>
            <p>Escolha uma função para gerenciar o estoque.</p>
          </div>
          <button className="ghost-button" onClick={handleLogout}>
            Sair
          </button>
        </header>

        <section className="dashboard-top-cards">
          <div className="stat-card">
            <p>Total de itens</p>
            <strong>{totalItems}</strong>
          </div>
          <div className="stat-card">
            <p>Produtos cadastrados</p>
            <strong>{stock.length}</strong>
          </div>
          <div className="stat-card">
            <p>Valor total</p>
            <strong>R$ {totalValue.toFixed(2)}</strong>
          </div>
        </section>

        <div className="dashboard-grid">
          <aside className="dashboard-menu">
            <h2>Menu</h2>
            <div className="menu-buttons">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  className={item.key === selectedAction ? 'menu-button active' : 'menu-button'}
                  onClick={() => {
                    if (item.key === 'logout') {
                      handleLogout()
                    } else {
                      setSelectedAction(item.key)
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          <main className="dashboard-main">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Função ativa</p>
                <h2>{menuItems.find((item) => item.key === selectedAction)?.label}</h2>
              </div>
              <div className="mini-card">
                <span>0 - Sair</span>
              </div>
            </div>

            {selectedAction === 'add' && (
              <section className="panel-body">
                <p>Adicione novos produtos ao estoque.</p>
                <form className="form-grid" onSubmit={handleAddProduct}>
                  <label>
                    Nome do produto
                    <input
                      value={newProduct.name}
                      onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })}
                      placeholder="Ex: Teclado"
                    />
                  </label>
                  <label>
                    Quantidade
                    <input
                      type="number"
                      min="0"
                      value={newProduct.quantity}
                      onChange={(event) => setNewProduct({ ...newProduct, quantity: event.target.value })}
                      placeholder="12"
                    />
                  </label>
                  <label>
                    Preço unitário
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })}
                      placeholder="79.90"
                    />
                  </label>
                  <button type="submit" className="primary-button full-width">
                    Adicionar produto
                  </button>
                </form>
              </section>
            )}

            {selectedAction === 'view' && (
              <section className="panel-body">
                <div className="search-row">
                  <input
                    placeholder="Buscar produto"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>
                {filteredStock.length === 0 ? (
                  <div className="empty-state">
                    Não há produtos no estoque com esse nome.
                  </div>
                ) : (
                  <div className="product-grid">
                    {filteredStock.map((item) => (
                      <article key={item.id} className="product-card">
                        <div className="product-card-header">
                          <strong>{item.name}</strong>
                          <span>R$ {item.price.toFixed(2)}</span>
                        </div>
                        <p>Quantidade: {item.quantity}</p>
                        <p>Valor total: R$ {(item.quantity * item.price).toFixed(2)}</p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {selectedAction === 'remove' && (
              <section className="panel-body">
                <p>Remova produtos que não fazem mais parte do estoque.</p>
                <label>
                  Produto
                  <select
                    value={selectedProductId}
                    onChange={(event) => setSelectedProductId(event.target.value)}
                  >
                    <option value="">Selecione um item</option>
                    {stock.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.quantity})
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" className="danger-button full-width" onClick={handleRemoveProduct}>
                  Remover produto
                </button>
              </section>
            )}

            {selectedAction === 'update' && (
              <section className="panel-body">
                <p>Atualize a quantidade de um produto existente.</p>
                <label>
                  Produto
                  <select
                    value={selectedProductId}
                    onChange={(event) => setSelectedProductId(event.target.value)}
                  >
                    <option value="">Selecione um item</option>
                    {stock.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.quantity})
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Nova quantidade
                  <input
                    type="number"
                    min="0"
                    value={updateQty}
                    onChange={(event) => setUpdateQty(event.target.value)}
                    placeholder="Ex: 30"
                  />
                </label>
                <button type="button" className="primary-button full-width" onClick={handleUpdateQuantity}>
                  Atualizar quantidade
                </button>
              </section>
            )}
          </main>
        </div>

        {notification && (
          <div className={`toast ${notification.variant}`}>
            {notification.message}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="page page-auth">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark">E</div>
          <div>
            <p className="eyebrow">Acesso</p>
            <h1>{formTitle}</h1>
          </div>
        </div>

        {authMode === 'login' ? (
          <form className="form-grid" onSubmit={handleLogin}>
            <label>
              E-mail
              <input
                type="email"
                value={loginData.email}
                onChange={(event) => setLoginData({ ...loginData, email: event.target.value })}
                required
                placeholder="usuario@exemplo.com"
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={loginData.password}
                onChange={(event) => setLoginData({ ...loginData, password: event.target.value })}
                required
                placeholder="••••••••"
              />
            </label>
            <button type="submit" className="primary-button full-width">
              Entrar
            </button>
            <button type="button" className="secondary-button full-width" onClick={() => setAuthMode('signup')}>
              Criar conta
            </button>
          </form>
        ) : (
          <form className="form-grid" onSubmit={handleSignup}>
            <label>
              Nome
              <input
                value={signupData.name}
                onChange={(event) => setSignupData({ ...signupData, name: event.target.value })}
                required
                placeholder="Seu nome"
              />
            </label>
            <label>
              E-mail
              <input
                type="email"
                value={signupData.email}
                onChange={(event) => setSignupData({ ...signupData, email: event.target.value })}
                required
                placeholder="usuario@exemplo.com"
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={signupData.password}
                onChange={(event) => setSignupData({ ...signupData, password: event.target.value })}
                required
                placeholder="••••••••"
              />
            </label>
            <button type="submit" className="primary-button full-width">
              Criar conta
            </button>
            <button type="button" className="ghost-button full-width" onClick={() => setAuthMode('login')}>
              Já tenho conta
            </button>
          </form>
        )}

        <button className="ghost-button full-width" onClick={() => setPage('landing')}>
          Voltar
        </button>
      </div>

      {notification && (
        <div className={`toast ${notification.variant}`}>
          {notification.message}
        </div>
      )}
    </div>
  )
}

export default App
