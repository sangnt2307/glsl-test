import * as THREE from 'three'
import Experience from './Experience.js'
import vertexShader from './shaders/plane/vertex.glsl'
import fragmentShader from './shaders/plane/fragment.glsl'




export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.renderer = this.experience.renderer

        this.meshes = []

        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setDummy()
            }
        })

        // if(this.debug)
        // {
        //     this.debugFolder = this.debug.addFolder({
        //         title: 'Settings',
        //         expanded: true
        //     })
        // }
    }

    setDummy()
    {   
        this.textures = Object.values(this.resources.items)
        console.log(this.textures)
        
        this.material = new THREE.ShaderMaterial(
            {   
                extensions: {
                    derivatives: "#extension GL_DES_standard_derivatives: enable"
                },
                side: THREE.DoubleSide,
                uniforms: {
                    uTexture: {
                        value: null
                    },
                },
                vertexShader,
                fragmentShader,
                // wireframe: true
            }
        )
        this.geometry = new THREE.PlaneGeometry(2, 2, 10, 10)
        

        
        this.textures.forEach((t, i) => {
            let m = this.material.clone()
            m.uniforms.uTexture.value = t
            let mesh = new THREE.Mesh(this.geometry, m)
            this.scene.add(mesh)
            this.meshes.push(mesh)
            mesh.position.x = i*2.0 - 2.0
            // mesh.position.y = -2
            mesh.position.z = .25
            // mesh.rotation.z = Math.PI/2
            mesh.scale.set(.75,.75,.75)
        })
        
        
    }

    resize()
    {
    }

    update()
    {
        this.meshes.forEach((m,i) =>{
            m.position.y = - this.renderer.settings.progress 
            m.rotation.z = Math.PI/3*this.renderer.settings.progress
        })
    }

    destroy()
    {
    }
}