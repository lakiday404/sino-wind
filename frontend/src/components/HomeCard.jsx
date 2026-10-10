import { useNavigate } from 'react-router-dom'

// 🎨 四大雅席意象图形（阶段一为内联矢量线描；阶段二可替换为 public/assets/home/ 下的设计切图）
const motifs = {
  // 博古识器 —— 青瓷瓶
  appraise: (
    <svg viewBox="0 0 64 64" className="home-card__svg" aria-hidden="true">
      <path d="M27 8h10" />
      <path d="M28 8c0 4-1 6-1 9 0 4 5 5 5 10" />
      <path d="M36 8c0 4 1 6 1 9 0 4-5 5-5 10" />
      <path d="M25 30c-6 3-9 8-9 14 0 7 7 12 16 12s16-5 16-12c0-6-3-11-9-14" />
      <path d="M24 44h16" />
    </svg>
  ),
  // 先贤论道 —— 煮茶对坐
  debate: (
    <svg viewBox="0 0 64 64" className="home-card__svg" aria-hidden="true">
      <path d="M14 40h36" />
      <path d="M20 40c0-5 3-8 7-8s7 3 7 8" />
      <path d="M44 26c3 0 5 2 5 5s-2 5-5 5" />
      <path d="M40 30h5" />
      <path d="M22 48h28" />
      <path d="M30 22c2-3 2-5 0-8" />
    </svg>
  ),
  // 飞花诗令 —— 落花诗卷
  poem: (
    <svg viewBox="0 0 64 64" className="home-card__svg" aria-hidden="true">
      <path d="M16 22h26a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4z" />
      <path d="M20 30h18M20 36h14" />
      <path d="M46 18c4 1 6 4 5 8-3-1-4-3-4-5-1-1-1-2-1-3z" />
    </svg>
  ),
  // 四般闲事 —— 焚香炉
  leisure: (
    <svg viewBox="0 0 64 64" className="home-card__svg" aria-hidden="true">
      <path d="M18 30h28c0 10-6 16-14 16s-14-6-14-16z" />
      <path d="M18 30c-4 0-6-2-6-5M46 30c4 0 6-2 6-5" />
      <path d="M26 46l-2 6M38 46l2 6M32 46v6" />
      <path d="M32 20c3-3 3-6 0-9" />
    </svg>
  ),
}

export default function HomeCard({ item }) {
  const navigate = useNavigate()

  const go = (event) => {
    event.stopPropagation()
    navigate(item.path)
  }

  return (
    <div className="home-card" onClick={() => navigate(item.path)}>
      <span className="home-card__seal">{item.seal}</span>

      <div className="home-card__art">{motifs[item.key]}</div>

      <div className="home-card__body">
        <h3 className="home-card__title">{item.title}</h3>
        <p className="home-card__desc">{item.desc}</p>
      </div>

      <button className="home-card__enter" type="button" onClick={go}>
        进入 <span className="home-card__arrow">›</span>
      </button>
    </div>
  )
}
