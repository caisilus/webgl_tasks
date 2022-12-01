#version 300 es

precision mediump float;
        
in vec3 vertPosition;
in vec3 vertColor;
out vec3 color;
in vec2 vertTexCoord;
out vec2 fragTexCoord;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
    fragTexCoord = vertTexCoord;
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    color = vertColor;
}