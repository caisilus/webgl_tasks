#version 300 es

precision mediump float;
        
in vec3 vertPosition;
in vec3 vertColor;
out vec3 color;

in vec2 vertTexCoord;
out vec2 fragTexCoord;

in vec3 vertNormal;
out vec3 fragNormal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

in float radius;
in float startingAngle;
in float angularSpeed;

uniform mat4 mWorld;
uniform mat4 mCamera;

uniform vec3 u_lightWorldPosition;
uniform vec3 camPosition;

void main()
{
    fragTexCoord = vertTexCoord;
    fragNormal = (mWorld * vec4(vertNormal,0.0)).xyz;
    gl_Position = mCamera * (mWorld * vec4(vertPosition, 1.0));
    color = vertColor;

    vec3 surfaceWorldPosition = (mWorld * vec4(vertPosition,1.0)).xyz;
    v_surfaceToLight = normalize(u_lightWorldPosition - surfaceWorldPosition);
    v_surfaceToView = normalize(camPosition- surfaceWorldPosition);
}