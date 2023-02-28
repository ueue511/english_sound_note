import React, { useState, useEffect, useRef } from 'react'

function App (): any {
  // 再描写の影響を受けない不変のオブジェクト
  const audioContext: React.MutableRefObject<AudioContext | null> = useRef(null)

  // 内部状態
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)

  // 初期化
  useEffect(() => {
    audioContext.current = new AudioContext()
  }, [])

  // イベントコールバック
  const handleChangeFile = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (event.target.files !== null && audioContext.current !== null) {
      const _file = event.target.files[0]
      const _audioBuffer = await audioContext.current.decodeAudioData(
        await _file.arrayBuffer()
      )
      setAudioBuffer(_audioBuffer)
    }
  }

  const handleClickPlay = async (): Promise<void> => {
    if (audioContext.current !== null) {
      if (audioContext.current.state === 'suspended') {
        await audioContext.current.resume()
      }
      // ソースノード生成 ＋ 音声を設定
      const sourceNode = audioContext.current.createBufferSource()
      sourceNode.buffer = audioBuffer

      // 出力先に接続
      sourceNode.connect(audioContext.current.destination)

      // 再生発火
      sourceNode.start()
    }
  }

  return (
    <div>
      <input type="file" onChange={handleChangeFile} />
      <button onClick={handleClickPlay}>再生</button>
    </div>
  )
}

export default App
