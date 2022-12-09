#version 300 es

precision mediump float;

in vec3 color;
in vec2 fragTexCoord;
out vec4 fragColor;
        
void main()
{
    fragColor = vec4(color, 1.0);
}