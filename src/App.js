import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { ArcballControls } from 'three/addons/controls/ArcballControls.js'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'

function App() {
    const mountRef = useRef(null)


    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 15
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        mountRef.current.appendChild(renderer.domElement)

        // OrbitControls
        const controls = new ArcballControls(camera, renderer.domElement, scene)
        controls.addEventListener('change', () => renderer.render(scene, camera)) // Render only when controls change

        // Custom shader material
        let material = new THREE.PointsMaterial({
            size: 0.005,
            color: 0xffffff
        })

        const loader = new PLYLoader()
        loader.load(
            process.env.PUBLIC_URL + '/model.ply',
            (bufferGeometry) => {
                bufferGeometry.center()
                const points = new THREE.Points(bufferGeometry, material)
                scene.add(points)
                renderer.render(scene, camera)
            }
        )

        // Initial render
        renderer.render(scene, camera)

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.render(scene, camera)
        }

        window.addEventListener('resize', handleResize)

        // Clean up on unmount
        return () => {
            window.removeEventListener('resize', handleResize)
            mountRef.current.removeChild(renderer.domElement)
            controls.dispose()
        }
    }, [])

    return (
        <div>
            <div ref={mountRef} />
        </div>
    )
}

export default App
