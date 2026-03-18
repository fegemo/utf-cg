#version 300 es
in vec4 position;
in vec2 texcoord;
out vec2 v_texCoord;

uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform mat4 u_textureMatrix;

void main() {
    gl_Position = u_projection * u_modelView * position;
    v_texCoord = mat2(u_textureMatrix) * texcoord;
}