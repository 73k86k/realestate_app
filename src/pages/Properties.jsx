import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PropertyForm from '../components/PropertyForm'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/propertiesApi'

// 家賃を「¥123,000」の形式に整形する
const formatRent = (rent) => `¥${rent.toLocaleString('ja-JP')}`

// 物件一覧画面（ログイン必須）
export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // 編集中の物件ID（null のときは編集していない）
  const [editingId, setEditingId] = useState(null)

  // 初回表示時に Supabase から物件一覧を取得する
  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch((err) => setError(`物件の取得に失敗しました：${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  // 新規登録：登録した物件を一覧の先頭に追加する
  const handleCreate = async (values) => {
    const created = await createProperty(values)
    setProperties((prev) => [created, ...prev])
  }

  // 編集：更新後の物件で一覧を置き換える
  const handleUpdate = async (id, values) => {
    const updated = await updateProperty(id, values)
    setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)))
    setEditingId(null)
  }

  // 削除：確認ダイアログで OK のときだけ削除する
  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか？`)) return

    setError('')
    try {
      await deleteProperty(property.id)
      setProperties((prev) => prev.filter((p) => p.id !== property.id))
    } catch (err) {
      setError(`削除に失敗しました：${err.message}`)
    }
  }

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

      <main className="properties-main">
        <section className="new-property">
          <h2>物件を登録する</h2>
          <PropertyForm submitLabel="登録する" onSubmit={handleCreate} />
        </section>

        {error && <p className="message error">{error}</p>}

        {loading ? (
          <p className="status-text">読み込み中...</p>
        ) : properties.length === 0 ? (
          <p className="status-text">登録された物件はまだありません。</p>
        ) : (
          <div className="property-grid">
            {properties.map((property) => (
              <article key={property.id} className="property-card">
                {editingId === property.id ? (
                  // 編集中のカードはフォームに切り替える
                  <PropertyForm
                    initialValues={property}
                    submitLabel="更新する"
                    onSubmit={(values) => handleUpdate(property.id, values)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <h3>{property.name}</h3>
                    <p className="rent">
                      {formatRent(property.rent)}
                      <span>／月</span>
                    </p>
                    <p className="area">
                      {property.area}
                      <span className="layout">{property.layout}</span>
                    </p>
                    <div className="card-actions">
                      <button className="secondary-button" onClick={() => setEditingId(property.id)}>
                        編集
                      </button>
                      <button className="danger-button" onClick={() => handleDelete(property)}>
                        削除
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
