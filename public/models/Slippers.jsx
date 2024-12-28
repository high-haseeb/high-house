import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/slippers.glb')
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.TrimSrf_1069.geometry} material={materials['재질_1.001']} position={[-0.033, 0.143, 0.253]} scale={0.001} />
    </group>
  )
}

useGLTF.preload('/slippers.glb')
