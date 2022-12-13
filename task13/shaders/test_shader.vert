#version 300 es

precision mediump float;
        
in vec3 vertPosition;
in vec3 vertColor;
out vec3 color;
in vec2 vertTexCoord;
out vec2 fragTexCoord;

in float radius;
in float startingAngle;
in float angularSpeed;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
uniform float angle;

void main()
{
    fragTexCoord = vertTexCoord;
    vec4 offset = vec4(radius * cos(startingAngle + angularSpeed * angle), 
                       radius * sin(startingAngle + angularSpeed * angle), 0, 1.0);
    gl_Position = mProj * mView * (mWorld * vec4(vertPosition, 1.0) + offset);
    color = vertColor;
}