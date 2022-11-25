#version 300 es

precision mediump float;

uniform vec3 figureColor;
out vec4 fragColor;
        
void main()
{
    fragColor = vec4(figureColor, 1.0);
}