import { useRef, useState } from 'react';
import './index.less'
import { useNavigate } from 'react-router-dom'
import { LeftOutline, CloseOutline, CameraOutline, PictureOutline } from 'antd-mobile-icons'


export default function Index({ 
  theme = 'default', 
  onRecognition, 
  recognitionResult,
  children
}) {
  
  const [selectedImage, setSelectedImage] = useState(null)
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // 主题颜色配置（国风：朱砂印泥红 / 沉金 / 宣纸绢帛，禁用旧版少儿橙）
  const themeConfig = {
    default: {
      primary: '#9E2A2B',
      secondary: '#FAF7F0',
      loading: '#9E2A2B',
      voice: '#C59B27',
      gradient: ['#FAF7F0', '#F5F0E6']
    },
    green: {
      primary: '#3A5A40',
      secondary: '#FAF7F0',
      loading: '#3A5A40',
      voice: '#C59B27',
      gradient: ['#F5F0E6', '#FAF7F0']
    }
  };
  const currentTheme = themeConfig[theme] || themeConfig.default

  const handleImageUpload = (e) => {
    // console.log(e.target.files[0]);
    const file = e.target.files[0]
    if (file) {
      // 将 file 对象转换成 url
      const imageUrl = URL.createObjectURL(file)
      // console.log(imageUrl);
      setSelectedImage(imageUrl)
      // ai 识别
      onRecognition(file)
    }
  }

  // 拍照
  const handleTakePhoto = async () => {
    // 打开摄像头
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    videoRef.current.srcObject = stream
    videoRef.current.play()

    setTimeout(() => {
      const canvas =  canvasRef.current
      const context = canvas.getContext('2d') // 创建二维画布
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

      // 停止摄像头
      stream.getTracks().forEach(track => track.stop())

      // 将 canvas 转换成 blob格式
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob)
          setSelectedImage(imageUrl)  // 预览图片

          const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' })
          // console.log(file);
          // ai 识别
          onRecognition(file)
        }
      }, 'image/jpeg', 0.8)
      
    }, 1000) 

  }

  // 清除预览
  const handleClear = () => {
    setSelectedImage(null)
    fileInputRef.current.value = null
    
  }

  return (
    <div className='image-capture-root'>
      <header className='image-capture-header'>
        <button className='image-capture-header__back' onClick={() => navigate(-1)}>
          <LeftOutline />
        </button>
        <h1>博古识器 · 拍照品鉴</h1>
        <div className="image-capture-header__placeholder"></div>
      </header>

      <main className="image-capture-main">
        <section className="image-capture-preview" style={{background: `radial-gradient(circle at 20% 20%, ${currentTheme.gradient[0]} 0, transparent 35%),
                      radial-gradient(circle at 90% 10%, ${currentTheme.gradient[1]} 0, transparent 40%),
                      #FAF7F0`}}
        >
          {
            selectedImage ? (
              <div className="image-capture-preview__image-container">
                <img src={selectedImage} alt="" className='image-capture-preview__image' />
                <button className='image-capture-preview__clear' onClick={handleClear}>
                  <CloseOutline />
                </button>
              </div>
            ) : (
              <div className="image-capture-preview__placeholder">
                <PictureOutline className='image-capture-preview__placeholder-icon' />
                <p>轻触下方按钮，拍摄或上传器物影像</p>
              </div>
            )
          }
        </section>

        <section className="image-capture-actions">
          <button 
            className='image-capture-btn image-capture-btn--primary'
            style={{backgroundColor: currentTheme.primary}}
            onClick={handleTakePhoto}
          >
            <CameraOutline />
            拍照
          </button>
          <button 
            className='image-capture-btn image-capture-btn--secondary'
            onClick={() => fileInputRef.current.click()}
          >
            <PictureOutline />
            上传图片
          </button>

          <input 
            type="file" 
            accept='image/*' 
            ref={fileInputRef} 
            onChange={handleImageUpload}
            style={{display: 'none'}}
          />

        </section>

        {
          children
        }
      </main>

      <video ref={videoRef}></video>
      {/* 画布，用来绘制视频帧 */}
      <canvas ref={canvasRef}></canvas>

    </div>
  )
}
