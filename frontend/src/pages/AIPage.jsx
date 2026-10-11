import React, { useState } from 'react'
import '../styles/aiPage.less'
import { useNavigate } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { RightOutline } from 'antd-mobile-icons'

export default function AIPage() {
  const navigate = useNavigate()
  
  // 当前选中的先贤（默认李白）
  const [selectedSage, setSelectedSage] = useState('libai')

  // 先贤画廊数据
  const sages = [
    { id: 'libai', name: '李白', title: '诗仙', avatar: '/assets/guancang/sage_libai.jpg', desc: '与谪仙人把酒言欢，对饮成三人' },
    { id: 'sushi', name: '苏轼', title: '东坡居士', avatar: '/assets/guancang/sage_sushi.jpg', desc: '一蓑烟雨任平生，品茶畅论人生豁达' },
    { id: 'wangyangming', name: '王阳明', title: '心学大家', avatar: '/assets/guancang/sage_wangyangming.jpg', desc: '知行合一，致良知，探索心之本体' },
    { id: 'liqingzhao', name: '李清照', title: '易安居士', avatar: '/assets/guancang/sage_liqingzhao.jpg', desc: '倚门回首，词压江南，共话婉约风雅' }
  ]

  // 三大古卷轴业务卡片数据
  const scrollCards = [
    {
      id: 'lundao',
      title: '古友论道',
      seal: '千载',
      subtitle: '与先贤畅谈诗词、人生与智慧',
      tags: ['诗词赏析', '人生问答', '风骨启迪'],
      bgImage: '/assets/guancang/scroll_lundao.jpg',
      route: '/ai-chat'
    },
    {
      id: 'changhe',
      title: '诗韵唱和',
      seal: '永和',
      subtitle: '对诗唱和，飞花传令，会古今雅趣',
      tags: ['飞花诗令', '诗句接龙', '唱和雅集'],
      bgImage: '/assets/guancang/scroll_changhe.jpg',
      route: '/ai-chat'
    },
    {
      id: 'tingyin',
      title: '抚琴听音',
      seal: '清心',
      subtitle: '与古友清谈，于琴音中静听山水',
      tags: ['语音相伴', '古琴清音', '沉浸雅境'],
      bgImage: '/assets/guancang/scroll_tingyin.jpg',
      route: '/ai-chat'
    }
  ]

  // 点击卡片跳转或提示
  const handleCardClick = (card) => {
    navigate(card.route, { state: { sageId: selectedSage } })
  }

  return (
    <div className='guancang-root'>
      {/* 1. 顶部水墨意境题头 */}
      <header className='guancang-header'>
        <div className='guancang-header__title-wrap'>
          <h1 className='guancang-header__title'>古风古友 · 千古知己</h1>
          <span className='guancang-header__seal'>云山竹简</span>
        </div>
        <p className='guancang-header__subtitle'>与千古知音对坐，听诗心与风骨</p>
      </header>

      {/* 2. 先贤横向画廊（横向滑动） */}
      <section className='sage-gallery-section'>
        <div className='sage-gallery-scroll'>
          {sages.map((sage) => (
            <div
              key={sage.id}
              className={`sage-card ${selectedSage === sage.id ? 'sage-card--active' : ''}`}
              onClick={() => {
                setSelectedSage(sage.id)
                Toast.show({ content: `已与【${sage.name}】对席`, duration: 1000 })
              }}
            >
              <img src={sage.avatar} alt={sage.name} className='sage-card__img' />
              <div className='sage-card__tag'>{sage.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 三大功能古卷轴列表 */}
      <section className='scroll-cards-section'>
        {scrollCards.map((card) => (
          <div
            key={card.id}
            className='scroll-card'
            style={{ backgroundImage: `url(${card.bgImage})` }}
            onClick={() => handleCardClick(card)}
          >
            <div className='scroll-card__content'>
              <div className='scroll-card__header'>
                <h2 className='scroll-card__title'>{card.title}</h2>
                <span className='scroll-card__seal'>{card.seal}</span>
              </div>
              <p className='scroll-card__sub'>{card.subtitle}</p>
              <div className='scroll-card__tags'>
                {card.tags.map((tag, idx) => (
                  <span key={idx} className='scroll-card__tag-pill'>{tag}</span>
                ))}
              </div>
            </div>
            <button className='scroll-card__action-btn' title='进入'>
              <RightOutline />
            </button>
          </div>
        ))}
      </section>
    </div>
  )
}