import { useNavigate } from 'react-router-dom'
import { RightOutline } from 'antd-mobile-icons'

// 🀄 雅席卡片：左侧文字（朱砂标题 + 释义 + 进入按钮），右侧设计插画
// 图标铁律：箭头统一使用 antd-mobile-icons 的 RightOutline（禁用原生字符 › / >）
export default function HomeCard({ item }) {
  const navigate = useNavigate()

  // 支持两种行为：跳转路由（item.path）或自定义回调（item.onClick，如古风 Toast）
  const activate = () => (item.onClick ? item.onClick() : navigate(item.path))

  const go = (event) => {
    event.stopPropagation()
    activate()
  }

  return (
    <div className="home-card" onClick={activate}>
      <div className="home-card__body">
        <h3 className="home-card__title">{item.title}</h3>

        <p className="home-card__desc">
          {item.desc.map((line, index) => (
            <span key={line}>
              {line}
              {index === item.desc.length - 1 && <RightOutline className="home-card__chevron" />}
            </span>
          ))}
        </p>

        <button className="home-card__enter" type="button" onClick={go}>
          进入 <RightOutline className="home-card__arrow" />
        </button>
      </div>

      <div className="home-card__art">
        <img src={item.art} alt={item.title} loading="lazy" />
      </div>
    </div>
  )
}
