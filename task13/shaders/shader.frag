#version 300 es

precision mediump float;

in vec3 color;
in vec2 fragTexCoord;
in vec3 fragNormal;
out vec4 fragColor;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;

uniform float texturesMix;
uniform float colorMix;
        
void main()
{
    vec4 tex_col1 = texture(u_texture1, fragTexCoord);
    vec4 tex_col2 = texture(u_texture2, fragTexCoord);
    fragColor =  mix(mix(tex_col1, tex_col2, texturesMix), vec4(color, 1.0), colorMix);
}