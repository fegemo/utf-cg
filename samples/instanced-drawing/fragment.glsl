#version 300 es

precision mediump float;

in vec2 v_texCoords;
in float v_fogFactor;
uniform sampler2D u_texture;
out vec4 o_color;

void main() {
    vec4 texColor = texture(u_texture, v_texCoords);
    if (texColor.a < 0.5) {
        discard;
    }
    float alpha = texColor.a * v_fogFactor;
    o_color = vec4(texColor.rgb * alpha, alpha);
}