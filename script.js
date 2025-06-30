let scene, camera, renderer;

init();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 10;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function runCommand() {
  const cmd = document.getElementById("command").value;
  try {
    evalCommand(cmd);
  } catch (e) {
    alert("Erro: " + e.message);
  }
}

function evalCommand(cmd) {
  const match = cmd.match(/(\w+)\((.*)\)/);
  if (!match) throw new Error("Comando inválido");

  const shape = match[1];
  const args = match[2].split(',').map(n => parseFloat(n.trim()));

  let geometry;

  switch (shape) {
    case "cube":
      geometry = new THREE.BoxGeometry(args[0], args[0], args[0]);
      break;
    case "sphere":
      geometry = new THREE.SphereGeometry(args[0], 32, 32);
      break;
    case "cylinder":
      geometry = new THREE.CylinderGeometry(args[0], args[0], args[1], 32);
      break;
    default:
      throw new Error("Forma não reconhecida: " + shape);
  }

  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}
