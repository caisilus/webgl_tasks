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

//Параметры точечного света
uniform int num_lights;
uniform vec3[10] lPosition;
uniform vec3 camPosition;
out vec3[10] tolDirection;
out vec3 v_surfaceToView;

//Параметры направленного света
uniform int num_spotlights;
uniform vec3[10] slPosition;
out vec3[10] toslDirection;

uniform bool pointLight;
uniform bool spotLight;

void main()
{
    fragTexCoord = vertTexCoord;
    fragNormal = (mWorld * vec4(vertNormal,0.0)).xyz;
    gl_Position = mCamera * (mWorld * vec4(vertPosition, 1.0));
    color = vertColor;

    vec3 surfaceWorldPosition = (mWorld * vec4(vertPosition,1.0)).xyz;
    //Если точечный источник света, то вычисляем вектор от поверхности до источника света
    if (pointLight)
    {
        for (int i = 0; i < num_lights; i++)
        {
            tolDirection[i] = lPosition[i] - surfaceWorldPosition;
        }
    }
    //Если направленный источник света, то вычисляем вектор от поверхности до источника света
    if (spotLight)
    {
        for (int i = 0; i < num_spotlights; i++)
        {
            toslDirection[i] = slPosition[i] - surfaceWorldPosition;
        }
    }
    v_surfaceToView = normalize(camPosition - surfaceWorldPosition);
}