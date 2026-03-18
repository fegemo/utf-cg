#version 300 es
precision mediump float;

in vec2 v_texCoord;
uniform vec4 u_color;
uniform bool u_isWire;
uniform float u_alphaThreshold;
uniform sampler2D u_diffuse;
out vec4 outColor;

void main() {
    vec4 color = u_isWire == true ? u_color : (texture(u_diffuse, v_texCoord) * u_color);
    
    if (color.a < u_alphaThreshold) {
        discard;
    }
    outColor = color;
    
}