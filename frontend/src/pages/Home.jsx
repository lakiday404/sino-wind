import '../styles/home.less'
import HomeCard from '../components/HomeCard'

// 🏮 首页【雅集】数据（阶段一为静态 Mock，阶段二接入后端真实数据）
const poem = {
  verse: ['山水之乐，', '在乎山水之间也。'],
  from: '—— 欧阳修《醉翁亭记》',
  seal: '雅集',
}

const almanac = {
  city: '杭州',
  temp: '24°',
  weather: '多云 空气优',
  lunar: '农历 三月廿六',
  ganzhi: '乙巳年 庚辰月 丙午日',
  term: '清明',
  termDesc: ['万物清明', '春和景明'],
}

// 四大核心雅席入口（2×2 宫格）
const yajiEntries = [
  { key: 'appraise', title: '博古识器', desc: '识古今之器\n赏华夏之美', seal: '藏', path: '/recognition' },
  { key: 'debate', title: '先贤论道', desc: '与李白苏轼\n共话千年风骨', seal: '道', path: '/ai-chat' },
  { key: 'poem', title: '飞花诗令', desc: '以诗会友\n飞花成令', seal: '诗', path: '/ai' },
  { key: 'leisure', title: '四般闲事', desc: '焚香品茗\n插花弄趣', seal: '闲', path: '/mine' },
]

export default function Home() {
  // 背景：宣纸山水长卷（放在 public/assets/home/，随 base 路径解析）
  const bgUrl = `${import.meta.env.BASE_URL}assets/home/bg-paper.jpg`

  return (
    <div className="home-root" style={{ backgroundImage: `url(${bgUrl})` }}>
      {/* 顶部题头 */}
      <header className="home-hero">
        <div className="home-hero__title-row">
          <h1 className="home-hero__title">云山竹简</h1>
          <span className="home-hero__seal">华风</span>
        </div>
        <p className="home-hero__sub">读千年风雅 与君共此山河</p>
      </header>

      {/* 每日诗签 · 展开式横向卷轴 */}
      <section className="home-poem">
        <div className="home-poem__tag">每日诗签</div>
        <div className="home-poem__body">
          <p className="home-poem__verse">
            {poem.verse.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <p className="home-poem__from">{poem.from}</p>
          <span className="home-poem__seal">{poem.seal}</span>
        </div>
      </section>

      {/* 岁时节气与干支物候 */}
      <section className="home-almanac">
        <div className="home-almanac__col home-almanac__col--weather">
          <p className="home-almanac__city">{almanac.city}</p>
          <p className="home-almanac__temp">{almanac.temp}</p>
          <p className="home-almanac__desc">{almanac.weather}</p>
        </div>
        <div className="home-almanac__col home-almanac__col--lunar">
          <p className="home-almanac__lunar">{almanac.lunar}</p>
          <p className="home-almanac__ganzhi">{almanac.ganzhi}</p>
        </div>
        <div className="home-almanac__col home-almanac__col--term">
          <p className="home-almanac__term">{almanac.term}</p>
          <p className="home-almanac__term-desc">
            {almanac.termDesc.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>
      </section>

      {/* 四大核心雅席入口 */}
      <section className="home-grid">
        {yajiEntries.map((item) => (
          <HomeCard key={item.key} item={item} />
        ))}
      </section>
    </div>
  )
}
