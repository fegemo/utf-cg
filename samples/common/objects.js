import * as twgl from './twgl-full.module.js';

const m4 = twgl.m4;
const v3 = twgl.v3;

export class AnObject {
  constructor(modelMatrix = m4.identity(), bufferInfo, texture, color = [1, 1, 1, 1]) {
    this.modelMatrix = modelMatrix;
    this.bufferInfo = bufferInfo;
    this._texture = texture;
    this.color = color;
    this.black = [0, 0, 0, 0.85];

    this.objectUniforms = {
      u_diffuse: this.texture,
      u_alphaThreshold: 0.7
    };
  }

  getPrimitive(gl) {
    return gl.TRIANGLES
  }

  update(dt) {

  }

  render(gl, programInfo, sceneUniforms, isWireframe = false) {
    const uniforms = Object.assign({}, sceneUniforms, this.objectUniforms);
    uniforms.u_modelView = m4.multiply(uniforms.u_viewMatrix, this.modelMatrix);
    uniforms.u_isWire = false;
    uniforms.u_color = isWireframe ? [this.color[0], this.color[1], this.color[2], this.color[3]-0.15] : this.color;
    twgl.setUniforms(programInfo, uniforms);
    twgl.setBuffersAndAttributes(gl, programInfo, this.bufferInfo);
    twgl.drawBufferInfo(gl, this.bufferInfo, this.getPrimitive(gl));
    if (isWireframe) {
      uniforms.u_color = this.black;
      uniforms.u_isWire = true;
      twgl.setUniforms(programInfo, uniforms);
      twgl.drawBufferInfo(gl, this.bufferInfo, gl.LINE_LOOP);
    }
  }

  setUniform(name, value) {
    this.objectUniforms[name] = value;
  }

  get texture() {
    return this._texture;
  }

  set texture(value) {
    if (this._texture !== value && value != null) {
      this._texture = value;
      this.objectUniforms.u_diffuse = value;
    }
  }
}


export class Sprite extends AnObject {
  constructor(gl, texture, modelMatrix = m4.identity(), width = 1, height = 1, subdivisions = 1) {
    super(modelMatrix, twgl.primitives.createPlaneBufferInfo(gl, width, height, subdivisions, subdivisions), texture);
  }
}

export class Billboard extends Sprite {
  constructor(gl, texture, modelMatrix = m4.identity(), type = 'axial', width = 1, height = 1) {
    super(gl, texture, modelMatrix, width, height);
    this._type = type;
    this.originalModelMatrix = m4.copy(modelMatrix);
  }

  update(dt) {
    if (this.lookingAt) {
      const { theta, phi, tilt } = this.lookingAt.rotations;

      switch (this.type) {
        case 'screen':
          m4.rotateZ(this.originalModelMatrix, theta, this.modelMatrix);
          m4.rotateX(this.modelMatrix, phi, this.modelMatrix);
          m4.rotateY(this.modelMatrix, tilt, this.modelMatrix);
          break;
        case 'world':
          m4.rotateZ(this.originalModelMatrix, theta, this.modelMatrix);
          m4.rotateX(this.modelMatrix, phi, this.modelMatrix);
          break;
        case 'axial':
          m4.rotateZ(this.originalModelMatrix, theta, this.modelMatrix);
          break;
      };
    }
  }

  track(camera) {
    if (camera) {
      this.lookingAt = camera;
    } else {
      this.lookingAt = null;
      this.modelMatrix = m4.copy(this.originalModelMatrix);
    }
  }

  get isTracking() {
    return this.lookingAt !== null;
  }

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }
}


export class Cube extends AnObject {
  constructor(gl, texture, modelMatrix = m4.identity(), size = v3.create(1, 1, 1)) {
    super(modelMatrix, twgl.primitives.createCubeBufferInfo(gl, size), texture);
  }
}

export class Grid extends AnObject {
  constructor(gl, texture, y = 0, size = 10, divisions = 10) {
    // cria vértices variando x e z, mantendo y constante
    const vertices = [];
    for (let i = 0; i <= divisions; i++) {
      const p = -size / 2 + (i / divisions) * size;
      vertices.push(p, y, -size / 2); // esquerda
      vertices.push(p, y, size / 2);  // direita
      vertices.push(-size / 2, y, p); // perto
      vertices.push(size / 2, y, p);  // longo
    }
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: { numComponents: 3, data: vertices }
    });
    super(m4.identity(), bufferInfo, texture, [0.5, 0.5, 0.5, 1]);
  }

  getPrimitive(gl) {
    return gl.LINES
  }
}



export class Axis extends AnObject {
  constructor(gl, modelMatrix, texture, name, dimensionIndex, positiveLength = 1, 
    ticks = [], drawNegativeToo = true, drawArrows = true) {
      const axisVector = v3.create(...Axis.rollArrayRight([1, 0, 0], dimensionIndex))
      const scaledVector = v3.mulScalar(axisVector, positiveLength)
      const vertices = []
      // positive
      vertices.push(0, 0, 0)
      vertices.push(...scaledVector)
      if (drawNegativeToo) {
        // negative
        vertices.push(0, 0, 0)
        vertices.push(...v3.mulScalar(scaledVector, -1))
      }
      const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
        position: {numComponents: 3, data: vertices }
      })
      const axisColor = [
        [0.98, 0.04, 0.00, 1],  // nice red (from blender gizmo)
        [0.30, 0.75, 0.00, 1],  // nice green 
        [0.19, 0.58, 0.91, 1]   // nice blue
      ][dimensionIndex]
      super(modelMatrix, bufferInfo, texture, axisColor)

      // store some metadata
      this._axisVector = axisVector
      this._positiveLength = positiveLength
      this._name = name

      // create a small canvas texture with the axis name
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const canvW = 256
        const canvH = 64
        canvas.width = canvW
        canvas.height = canvH
        // choose font size relative to canvas
        const fontSize = 36
        ctx.clearRect(0, 0, canvW, canvH)
        ctx.font = `${fontSize}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const r = Math.floor(axisColor[0] * 255)
        const g = Math.floor(axisColor[1] * 255)
        const b = Math.floor(axisColor[2] * 255)
        // draw a dark stroke for contrast, then fill with axis color
        ctx.lineWidth = 6
        ctx.strokeStyle = `rgba(0,0,0,0.85)`
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`
        ctx.strokeText(name, canvW / 2, canvH / 2)
        ctx.fillText(name, canvW / 2, canvH / 2)

        // create texture without mipmaps to avoid low-res alpha bleeding
        const tex = twgl.createTexture(gl, { src: canvas, mag: gl.LINEAR, min: gl.LINEAR, wrap: gl.CLAMP_TO_EDGE, premultiplyAlpha: true })

        // position label slightly past the positive tip
        const offset = v3.mulScalar(axisVector, positiveLength * 1.05)
        const labelModel = m4.translate(m4.copy(this.modelMatrix), offset)
        const labelWidth = positiveLength * 0.35
        const labelHeight = positiveLength * 0.12

        // use a screen-aligned billboard for the label
        this._label = new Billboard(gl, tex, labelModel, 'screen', labelWidth, labelHeight)
        // make sure the label draws its texture (allow alpha blending)
        this._label.objectUniforms.u_alphaThreshold = 0.01
        this._label.color = [1, 1, 1, 1]
      } catch (e) {
        // if canvas/textures aren't available, skip label creation silently
        this._label = null
      }
  }
  
  getPrimitive(gl) {
    return gl.LINES
  }

  track(camera) {
    if (this._label && this._label.track) {
      this._label.track(camera)
    }
  }

  update(dt) {
    if (this._label && this._label.update) this._label.update(dt)
  }

  render(gl, programInfo, sceneUniforms, isWireframe = false) {
    super.render(gl, programInfo, sceneUniforms, isWireframe)
    if (this._label) {
      // ensure label's modelView considers the current view matrix
      this._label.render(gl, programInfo, sceneUniforms, false)
    }
  }

  static rollArrayLeft(array, amount) {
    amount = amount % array.length
    return array.slice(amount, array.length).concat(array.slice(0, amount))
  }

  static rollArrayRight(array, amount) {
    amount = (-1 * amount + array.length)
    return Axis.rollArrayLeft(array, amount)
  }
}