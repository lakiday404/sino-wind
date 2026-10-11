import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/app.less'
import Layout from './pages/Layout'
import Home from './pages/Home'
import AIPage from './pages/AIPage'
import MinePage from './pages/MinePage'
import Recognition from './pages/Recognition'
import AccountSetting from './pages/AccountSetting'
import AiChat from './pages/AiChat'
import AuthPage from './pages/AuthPage'
import PoemPage from './pages/PoemPage' // 成员 B：古诗词天地
import PoemCollection from './pages/PoemCollection' // 成员 C：书斋 · 我的诗笺

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path='/login' element={<AuthPage/>}></Route>
        <Route path='/' element={<Layout/>}>
          {/* 默认重定向 */}
          <Route path='' element={<Navigate to='/home' />}></Route>
          <Route path='/home' element={<Home/>}></Route>
          <Route path='/ai' element={<AIPage/>}></Route>
          <Route path='/mine' element={<MinePage/>}></Route>
          <Route path='/recognition' element={<Recognition/>}></Route>
        </Route>
        <Route path='/accountSetting' element={<AccountSetting/>}></Route>
        <Route path='/ai-chat' element={<AiChat/>}></Route>
        {/* 成员 B：古诗词天地（首页「飞花诗令」入口） */}
        <Route path='/poem' element={<PoemPage/>}></Route>
        {/* 成员 C：书斋 · 我的诗笺（摘录沉淀列表） */}
        <Route path='/poem-collection' element={<PoemCollection/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
