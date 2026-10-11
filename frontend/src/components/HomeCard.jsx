import { useNavigate } from 'react-router-dom'

// 🀄 雅席卡片：左侧文字（朱砂标题 + 释义 + 进入按钮），右侧设计插画
export default function HomeCard({ item }) {
  const navigate = useNavigate()

  const go = (event) => {
    event.stopPropagation()
    navigate(item.path)
  }

  return (
    <div className="home-card" onClick={() => navigate(item.path)}>
      <div className="home-card__body">
        <h3 className="home-card__title">{item.title}</h3>

        <p className="home-card__desc">
          {item.desc.map((line, index) => (
            <span key={line}>
              {line}
              {index === item.desc.length - 1 && <em className="home-card__chevron">›</em>}
            </span>
          ))}
        </p>

        <button className="home-card__enter" type="button" onClick={go}>
          进入 <span className="home-card__arrow">›</span>
        </button>
      </div>

      <div className="home-card__art">
        <img src={item.art} alt={item.title} loading="lazy" />
      </div>
    </div>
  )
}
