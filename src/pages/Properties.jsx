import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { properties } from '../data/properties'

// 家賃を「¥123,000」の形式に整形する
const formatRent = (rent) => `¥${rent.toLocaleString('ja-JP')}`

// 物件一覧画面（ログイン必須）
export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="properties-page">
      <header className="header">
        <h1>物件一覧</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button className="logout-button" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      <main className="property-grid">
        {properties.map((property) => (
          <article key={property.id} className="property-card">
            <h2>{property.name}</h2>
            <p className="rent">
              {formatRent(property.rent)}
              <span>／月</span>
            </p>
            <p className="area">{property.area}</p>
          </article>
        ))}
      </main>
    </div>
  )
}
