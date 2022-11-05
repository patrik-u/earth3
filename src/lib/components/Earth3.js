//#region imports
import { useRef, useState } from "react";
import { ChakraProvider, Box, Button } from "@chakra-ui/react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, extend } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
//#endregion

const GlobeShaderMaterial = shaderMaterial(
    // uniform
    {
        uAtmosphereColor: new THREE.Color(0xff0000),
        uTexture: new THREE.TextureLoader().load("./images/1_earth_8k.jpg"),
    },
    // vertex shader
    glsl`
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
            vUv = uv;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    // fragment shader
    glsl`
        precision mediump float;
        uniform vec3 uAtmosphereColor;
        uniform sampler2D uTexture;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
            float intensity = 1.05 - dot(vNormal, vec3(0.0, 0.0, 1.0));
            vec3 atmosphere = uAtmosphereColor * pow(intensity, 1.5);
            gl_FragColor = vec4(atmosphere + texture2D(uTexture, vUv).xyz, 1.0);            
        }
    `
);

extend({ GlobeShaderMaterial });

const Earth3 = ({ wireframe }) => {
    const shaderRef = useRef();
    const globeMeshRef = useRef();
    const earthMap = useLoader(TextureLoader, "./images/1_earth_8k.jpg");
    //const earthMap = useLoader(TextureLoader, "./images/2_no_clouds_8k.jpg");

    useFrame(({ clock }, delta) => {
        if (!globeMeshRef.current) return;
        //globeMeshRef.current.rotation.x += 0.5 * delta;
        globeMeshRef.current.rotation.y += -0.2 * delta;
        //globeMeshRef.current.rotation.z += 0.5 * delta;
        //globeMeshRef.current.uTime = clock.getElapsedTime();
        //shaderRef.current.uTime = clock.getElapsedTime();
    });

    return (
        <>
            <PerspectiveCamera makeDefault fov={75} position={[0, 0, 10]} />
            <pointLight position={[10, 10, 10]} />
            <ambientLight intensity={0.1} />
            <OrbitControls autoRotate={false} />
            <mesh ref={globeMeshRef}>
                <sphereGeometry args={[5, 32, 32]} />
                <meshStandardMaterial map={earthMap} wireframe={wireframe} />
                {/* <globeShaderMaterial ref={shaderRef} uAtmosphereColor="#2873ff" /> */}
            </mesh>
        </>
    );
};

export default Earth3;
