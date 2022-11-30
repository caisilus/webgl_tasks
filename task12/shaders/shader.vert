#version 300 es

precision mediump float;
        
in vec2 vertPosition;
in vec3 vertColor;
out vec3 color;

uniform mat2 rotation;

void main()
{
    gl_Position = vec4(rotation * vertPosition * 0.5, 0.0, 1.0);
    color = vertColor;
}