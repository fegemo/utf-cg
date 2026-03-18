import * as twgl from '../../samples/common/twgl-full.module.js';
import { degToRad } from '../../samples/common/math-utils.js';
import { OrbitCamera } from '../../samples/common/camera.js';
import { Cube, Grid, Axis } from '../../samples/common/objects.js';

const m4 = twgl.m4
const v3 = twgl.v3

let camera
let lastRenderTimestamp = 0
let gl = null
let programInfo = null
let scene = []

function render(timestamp) {
  const dt = (timestamp - lastRenderTimestamp) / 1000;
  lastRenderTimestamp = timestamp;
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  const projectionMatrix = m4.perspective(degToRad(60), gl.canvas.width / gl.canvas.height, 0.1, 1000);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  //atualiza a câmera
  camera.update(dt);
  
  const uniforms = {
    // time: time * 0.001,
    // resolution: [gl.canvas.width, gl.canvas.height],
    u_modelView: m4.identity(),
    u_projection: projectionMatrix,
    u_textureMatrix: m4.identity(),
    u_viewMatrix: m4.inverse(camera.cameraMatrix)
  };
  
  // desenha e atualiza os objetos da cena
  scene.forEach(object => {
    gl.enable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(true);
    const isWireframe = false; //object instanceof Cube;
    object.render(gl, programInfo, uniforms, isWireframe);
    object.update(dt);
  })
  
  requestAnimationFrame(render);
}

export async function initialize(canvas) {
  if (typeof canvas === 'string') {
    canvas = document.querySelector(canvas)
  }
  gl = canvas.getContext('webgl2');
  const vs = await fetch('../../samples/ndc/vertex.glsl').then(res => res.text());
  const fs = await fetch('../../samples/ndc/fragment.glsl').then(res => res.text());
  programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  const textures = twgl.createTextures(gl, {
    grass: { src: '../../samples/billboards/images/grass.jpg', mag: gl.LINEAR, min: gl.LINEAR_MIPMAP_LINEAR },
    tree: { src: '../../samples/billboards/images/tree.png', mag: gl.LINEAR, min: gl.LINEAR },
    title: { src: '../../samples/billboards/images/title.png', mag: gl.LINEAR, min: gl.LINEAR },
    box: { src: [100, 255, 100, 150], mag: gl.NEAREST, min: gl.NEAREST },
    null: { src: [255, 255, 255, 255], mag: gl.NEAREST, min: gl.NEAREST, }
  });


  // estado do webgl
  gl.clearColor(0, 0, 0, 0);
  gl.useProgram(programInfo.program);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  
  // câmeras
  camera = new OrbitCamera(degToRad(45), degToRad(75), 7, v3.create(0, 0, 0));
  camera.attach(window, gl.canvas);
  
  // objetos da cena
  const boxPosition = [0, 0, 0]
  const box = new Cube(gl, textures.box, m4.translate(m4.identity(), boxPosition), 2);
  const grid = new Grid(gl, textures.null, 0, 100, 100);
  const axes = ['x', 'y', 'z'].map((l, i) => 
    new Axis(gl, m4.translate(m4.identity(), boxPosition), 
  textures.null, l, i, 3,
  [], true, true
  ))
  box.objectUniforms.u_alphaThreshold = 0.1;

  camera.target = v3.create(...boxPosition)
  // scene.push(grid)
  // make axis labels face the camera
  axes.forEach(ax => ax.track(camera))
  axes.forEach(ax => scene.push(ax))
  scene.push(box)

  requestAnimationFrame(render)
}
