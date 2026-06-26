import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import loadingData from '../../assets/loading.json'

function Loader() {
  const containerRef = useRef(null)

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: loadingData,
    })
    return () => anim.destroy()
  }, [])

  return (
    <div className="flex justify-center items-center h-screen">
      <div ref={containerRef} style={{ width: 250, height: 300 }} />
    </div>
  )
}

export default Loader
