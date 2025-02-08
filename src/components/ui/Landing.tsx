'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Manrope } from 'next/font/google'
import Link from 'next/link'
import { Building2, Gavel, Key, Shield } from 'lucide-react'

const manrope = Manrope({ subsets: ['latin'] })

function SpinningLogo() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[-0.5, -0.5, -0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#999999" />
      </mesh>
    </group>
  )
}

function AnimatedBox({ initialPosition }: { initialPosition: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(...initialPosition))
  const currentPosition = useRef(new THREE.Vector3(...initialPosition))

  const getAdjacentIntersection = (current: THREE.Vector3) => {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
    const randomDirection = directions[Math.floor(Math.random() * directions.length)]
    return new THREE.Vector3(
      current.x + randomDirection[0] * 3,
      0.5,
      current.z + randomDirection[1] * 3
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newPosition = getAdjacentIntersection(currentPosition.current)
      newPosition.x = Math.max(-15, Math.min(15, newPosition.x))
      newPosition.z = Math.max(-15, Math.min(15, newPosition.z))
      setTargetPosition(newPosition)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      currentPosition.current.lerp(targetPosition, 0.1)
      meshRef.current.position.copy(currentPosition.current)
    }
  })

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" opacity={0.9} transparent />
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial attach="material" color="#000000" linewidth={2} />
      </lineSegments>
    </mesh>
  )
}

function Scene() {
  const initialPositions: [number, number, number][] = [
    [-9, 0.5, -9],
    [-3, 0.5, -3],
    [0, 0.5, 0],
    [3, 0.5, 3],
    [9, 0.5, 9],
    [-6, 0.5, 6],
    [6, 0.5, -6],
    [-12, 0.5, 0],
    [12, 0.5, 0],
    [0, 0.5, 12],
  ]

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid
        renderOrder={-1}
        position={[0, 0, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.5}
        sectionSize={3}
        sectionThickness={1}
        sectionColor={[0.5, 0.5, 0.5]}
        fadeDistance={50}
      />
      {initialPositions.map((position, index) => (
        <AnimatedBox key={index} initialPosition={position} />
      ))}
    </>
  )
}

export default function Component() {
  return (
    <div>
      <div className={`relative w-full h-screen bg-black text-white overflow-hidden ${manrope.className}`}>
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <nav className="flex justify-center items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="w-20 h-20">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <SpinningLogo />
              </Canvas>
            </div>
           
          </div>
          
        </nav>
      </header>
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
        <h1 className="text-6xl font-bold mb-8 max-w-4xl mx-auto">The Future of Rental Agreements is Here</h1>
        <h2 className="text-xl mb-10">Secure, automated, and transparent rental transactions powered by blockchain technology</h2>
        
      </div>

      
      <Canvas shadows camera={{ position: [30, 30, 30], fov: 50 }} className="absolute inset-0">
        <Scene />
      </Canvas>
      
    </div>
    <div className="flex justify-center space-x-4">
          <Link href="/register" className="bg-white text-black font-bold py-3 px-6 rounded-md hover:bg-gray-200 transition duration-300">
            Get Started
          </Link>
          <a href="#features" className="border text-white border-white py-3 px-6 rounded-md hover:bg-white/10 transition duration-300">
            Learn More
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-40 max-w-6xl mx-auto ">
          <div className="flex flex-col items-center bg-white/10 p-8 rounded-lg shadow-lg">
            <div className="bg-white/10 p-3 rounded-lg mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">Smart Contracts</h3>
            <p className="text-sm text-gray-400">Unbreakable agreements</p>
          </div>
          <div className="flex flex-col items-center bg-white/10 p-8 rounded-lg shadow-lg">
            <div className="bg-white/10 p-3 rounded-lg mb-3">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">Identity Verification</h3>
            <p className="text-sm text-gray-400">Secure & trusted</p>
          </div>
          <div className="flex flex-col items-center bg-white/10 p-8 rounded-lg shadow-lg">
            <div className="bg-white/10 p-3 rounded-lg mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">Property Management</h3>
            <p className="text-sm text-gray-400">Simplified process</p>
          </div>
          <div className="flex flex-col items-center bg-white/10 p-8 rounded-lg shadow-lg" >
            <div className="bg-white/10 p-3 rounded-lg mb-3">
              <Gavel className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">Dispute Resolution</h3>
            <p className="text-sm text-gray-400">Fair & transparent</p>
          </div>
        </div>
      </div>

    
  )
}

