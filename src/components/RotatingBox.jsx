import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshWobbleMaterial } from '@react-three/drei'

export default function RotatingBox() {
  const meshRef = useRef()

  // Rotate the mesh every frame
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta * 0.5
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      {/* Drei material with a wobble effect */}
      <MeshWobbleMaterial color="#4f46e5" factor={0.6} speed={2} />
    </mesh>
  )
}