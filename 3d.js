import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const camera  = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

camera.position.z = 3;

const scene = new THREE.Scene();
let model;
let mixer;

const loader = new GLTFLoader();
loader.load('/assets/demon_dragon.glb',
  function(gltf) {
    model = gltf.scene;
    model.position.y = -1.5;
    model.position.x = 1;

    model.rotation.y = -0.5; // Rotate 180 degrees
    
    // Auto-scale the model based on its bounding box size
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const scaleFactor = 5 / size; // Adjust scaling factor
    model.scale.setScalar(scaleFactor);

    scene.add(model)

    mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(gltf.animations[0]).play();
    console.log('animations', gltf.animations)
  },
  function(xhr) {},
  function(error) {}
)

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('container3D').appendChild(renderer.domElement)

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight)

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight)

const reRender3D = () => {
  requestAnimationFrame(reRender3D)
  renderer.render(scene, camera);
  if (mixer) mixer.update(0.02);
};
reRender3D();

let arrPositionModel = [
  {
    id: 'banner',
    position: { x: 0, y: -1, z:0 },
    position: { x: 0, y: 1.5, z:0 },
  },
  {
    id: 'parallaxContainer',
    position: { x: 1.5, y: -1, z:-5 },
    position: { x: 0.5, y: -0.5, z:0 },
  },
  {
    id: 'works',
    position: { x: -1, y: -1, z:-5 },
    position: { x: 0, y: 0.5, z:0 },
  },
  {
    id: 'techologies',
    position: { x: 1, y: -1, z:0 },
    position: { x: 0.3, y: -0.5, z:0 },
  },
  {
    id: 'footer',
    position: { x: 0, y: -1, z:0 },
    position: { x: 0, y: 1.5, z:0 },
  },
]

function modelMove() {
  const sections = document.querySelectorAll('[data-model]')
  let currentSection;
  sections.forEach(section => {
    const rect = section.getBoundingClientRect()
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.id;
    }
  })
  let position_active = arrPositionModel.findIndex((val) => {
    val.id == currentSection
  })

  if (position_active >= 0) {
    let new_coordinates = arrPositionModel[position_active]
    
    gsap.to(bot.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 3,
      ease: "power1.out"
    })

    gsap.to(bot.rotation, {
      x: new_coordinates.rotate.x,
      y: new_coordinates.rotate.y,
      z: new_coordinates.rotate.z,
      duration: 3,
      ease: "power1.out"
    })
  }
  console.log(currentSection)
}

window.addEventListener('scroll', () => {
  if (model) {
    modelMove()
  }
})

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
})