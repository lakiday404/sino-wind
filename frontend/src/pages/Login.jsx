import { useEffect, useRef, useState } from 'react'
import { Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import axios from '../http'
import '../styles/login.less'

export function AuthIcon({ name }) {
  const shapes = {
    account: 'M5 20v-2a7 7 0 0 1 14 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
    phone: 'M7 2h10v20H7zM10 18h4',
    lock: 'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4M12 14v3',
    shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6zM8 12l3 3 5-6',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    hidden: 'M3 3l18 18M3 9l-1 3s4 7 10 7c2 0 4-1 5-2M7 6c2-1 3-1 5-1 6 0 10 7 10 7l-3 4',
  }
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={shapes[name]} /></svg>
}

export default function Login({ user = {}, agreed = false }) {
  const [phone, setPhone] = useState(user.phone || '')
  const [password, setPassword] = useState(user.password || '')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const busy = useRef(false)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])
  const navigate = useNavigate()
  async function submit(event) {
    event.preventDefault()
    if (busy.current) return
    const account = phone.trim()
    const phoneRegex = /^1[3-9]\d{9}$/
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:qq\.com|163\.com|126\.com|sina\.(?:com|cn)|gmail\.com|foxmail\.com)$/i
    if (!phoneRegex.test(account) && !emailRegex.test(account)) return setError('请输入有效手机号或支持的邮箱')
    if (!/^.{6,20}$/.test(password)) return setError('通行密押须为 6–20 位字符')
    if (!agreed) return setError('请先勾选同意用户协议与隐私政策')
    busy.current = true
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post('/api/auth/login', { phone: account, password })
      if (!mounted.current) return
      if (typeof data?.token !== 'string' || !data.token.trim()) throw new Error('登录响应缺少凭证，请稍后重试')
      localStorage.setItem('token', data.token)
      setPassword('')
      navigate('/home', { replace: true })
    } catch (failure) {
      if (!mounted.current) return
      setError(failure?.response?.data?.message || failure?.data?.message || '入席未成功，请核对账号密押或稍后重试')
    } finally { busy.current = false; if (mounted.current) setLoading(false) }
  }
  return (
    <form className="auth-login" onSubmit={submit} noValidate aria-busy={loading}>
      <label className="auth-field"><span className="auth-field-icon" aria-hidden="true"><AuthIcon name="account" /></span><span className="auth-sr-only">手机号或信箱</span>
        <input name="username" autoComplete="username" type="text" inputMode="email" placeholder="请输入手机号" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} aria-describedby={error ? 'login-error' : undefined} />
      </label>
      <div className="auth-field"><span className="auth-field-icon" aria-hidden="true"><AuthIcon name="lock" /></span>
        <label className="auth-sr-only" htmlFor="login-password">通行密押</label>
        <input id="login-password" name="password" autoComplete="current-password" type={visible ? 'text' : 'password'} placeholder="请输入密码" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
        <button type="button" className="auth-eye" aria-label={visible ? '隐藏密码' : '显示密码'} aria-pressed={visible} onClick={() => setVisible(!visible)}><AuthIcon name={visible ? "eye" : "hidden"} /></button>
      </div>
      <div className="auth-forgot"><button type="button" onClick={() => Toast.show({ content: '密码找回暂未开放，请联系管理员' })}>忘记密码？</button></div>
      {error && <p className="auth-error" id="login-error" role="alert">{error}</p>}
      <button className="auth-submit" disabled={loading} type="submit">{loading ? '正在入席…' : '落座入席'}</button>
    </form>
  )
}
