#version 300 es

precision mediump float;
        
in vec3 vertPosition;
in vec3 vertColor;
out vec3 color;

in vec2 vertTexCoord;
out vec2 fragTexCoord;

in vec3 vertNormal;
out vec3 fragNormal;

in float radius;
in float startingAngle;
in float angularSpeed;

uniform mat4 mWorld;
uniform mat4 mCamera;
uniform float angle;

void main()
{
    fragTexCoord = vertTexCoord;
    vec4 offset = vec4(radius * cos(startingAngle + angularSpeed * angle), 
                       radius * sin(startingAngle + angularSpeed * angle), 0, 1.0);
    fragNormal = (mWorld * vec4(vertNormal,0.0)).xyz + offset.xyz;
    gl_Position = mCamera * (mWorld * vec4(vertPosition, 1.0) + offset);
    color = vertColor;
}