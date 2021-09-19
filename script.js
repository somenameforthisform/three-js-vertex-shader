let materialShader;

const waveWidth = `400.`;
const waveHeight = `5.`;
const meshColor = 0x44aa88;
const meshOpacity = 1;
const waveHeightExp = `0.`;
const waveSpeed = `3.`;
const customTransform = `
      vec3 transformed = vec3(position);
      transformed.x = position.x + ( sin(position.y * ${waveWidth} + time * ${waveSpeed}) * (${waveHeight} + time * ${waveSpeed} * ${waveHeightExp}));     
  `;

const addCamera = () => {
  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 320;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 280;

  return camera
}

const addLight = (scene) => {
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

const addMesh = (scene) => {
  const material = new THREE.MeshLambertMaterial({
    color: meshColor,
    transparent: true,
    opacity: meshOpacity
  })

  material.onBeforeCompile = (shader) => {
    shader.uniforms.time = { value: 0 };
    shader.vertexShader = `
        uniform float time;
        ` + shader.vertexShader;
    const token = "#include <begin_vertex>";
    shader.vertexShader = shader.vertexShader.replace(token, customTransform);
    materialShader = shader;
  }

  const geometry = new THREE.SphereGeometry(160, 160, 160);
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  return sphere
}

const resize = (renderer, camera) => {
  const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}

const main = () => {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });
  const scene = new THREE.Scene();
  const camera = addCamera();
  const sphere = addMesh(scene);
  const light = addLight(scene);


  function render(time) {
    if (materialShader)
      materialShader.uniforms.time.value = time / 1000;
    resize(renderer, camera)
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();