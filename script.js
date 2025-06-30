let scene, camera, renderer;
let createdObjects = [];
let rotateObjects = true;
let rotationAxis = 'y';

init();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  animate();
}

// Gira os objetos automaticamente
function animate() {
  requestAnimationFrame(animate);

  if (rotateObjects) {
    createdObjects.forEach(obj => {
      obj.rotation[rotationAxis] += 0.01;
    });
  }

  renderer.render(scene, camera);
}

// Executa o comando digitado
function runCommand() {
  const cmd = document.getElementById("command").value;
  try {
    evalCommand(cmd);
  } catch (e) {
    alert("Erro: " + e.message);
  }
}

// Interpreta os comandos
function evalCommand(cmd) {
  cmd = cmd.trim().toLowerCase();

  // Comando de rotação: rotate(angulo, eixo)
  if (cmd.startsWith("rotate")) {
    const match = cmd.match(/rotate\(([^,]+),\s*([xyz])\)/);
    if (!match) throw new Error("Use: rotate(ângulo, eixo)");

    const angle = parseFloat(match[1]) * (Math.PI / 180); // graus para radianos
    const axis = match[2];

    createdObjects.forEach(obj => {
      obj.rotation[axis] += angle;
    });
    return;
  }

  // Comando para criar forma: forma(n1, n2...)
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
  createdObjects.push(mesh);
}

// Teclas para mudar eixo de rotação
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') rotationAxis = 'x';
  if (e.key === 'ArrowRight') rotationAxis = 'y';
  if (e.key === 'ArrowDown') rotationAxis = 'z';
});
