#version 300 es

precision mediump float;

out vec4 fragColor;
        
void main()
{
    vec3 color = vec3(0.0, 1.0, 0.0);
    fragColor = vec4(color, 1.0);
}