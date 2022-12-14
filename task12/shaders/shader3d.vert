#version 300 es

precision mediump float;
        
in vec3 vertPosition;
in vec3 vertColor;
out vec3 color;
in vec2 vertTexCoord;
out vec2 fragTexCoord;
in vec3 vertNormal;
out vec3 fragNormal;

uniform mat4 mWorld;
uniform mat4 mCamera;

void main()
{
    fragTexCoord = vertTexCoord;
    fragNormal = vertNormal;
    gl_Position = mCamera * mWorld * vec4(vertPosition, 1.0);
    color = vertColor;
}