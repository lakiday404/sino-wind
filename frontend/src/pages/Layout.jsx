import '../styles/layout.less'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

// 🏮 公共底部导航（三栏：雅集 / 观藏 / 书斋）—— 器物图标为内联矢量线描，可后续替换为设计切图
function PavilionIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4 12 16 5l12 7z" />
      <path d="M7 12v3M25 12v3" />
      <path d="M10 15v11M22 15v11M16 15v11" />
      <path d="M5 27h22" />
    </svg>
  )
}

function CenserIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M9 14h14c0 5-3 8-7 8s-7-3-7-8z" />
      <path d="M9 14c-2 0-3-1-3-3M23 14c2 0 3-1 3-3" />
      <path d="M13 22l-1 4M19 22l1 4M16 22v4" />
      <path d="M16 9c2-2 2-4 0-6" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 8h9a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H6z" />
      <path d="M26 8h-4a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h5z" />
      <path d="M9 13h5M9 17h5" />
    </svg>
  )
}

const tabs = [
  { id: 'home', path: '/home', name: '雅集', Icon: PavilionIcon },
  { id: 'ai', path: '/ai', name: '观藏', Icon: CenserIcon },
  { id: 'mine', path: '/mine', name: '书斋', Icon: BookIcon },
]

export default function Layout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeTab = tabs.find((tab) => pathname.startsWith(tab.path))?.id || 'home'

  return (
    <div className="layout">
      <div className="layout-page">
        {/* 凡是 layout 的二级路由都展示在这里 */}
        <Outlet />
      </div>

      <nav className="bottom-nav">
        {tabs.map(({ id, path, name, Icon }) => (
          <button
            key={id}
            type="button"
            className={`bottom-nav__item ${activeTab === id ? 'is-active' : ''}`}
            onClick={() => navigate(path)}
          >
            <span className="bottom-nav__icon">
              <Icon />
            </span>
            <span className="bottom-nav__label">{name}</span>
            <i className="bottom-nav__seal" aria-hidden="true" />
          </button>
        ))}
      </nav>
    </div>
  )
}
