#version 300 es

precision mediump float;

in vec3 color;
in vec2 fragTexCoord;
in vec3 fragNormal;
out vec4 fragColor;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;

uniform float texturesMix;
uniform float colorMix;
uniform vec3 u_reverseLightDirection;
uniform float u_shininess;
uniform vec3 lColor;
uniform vec3 lAmbient;
uniform vec3 u_lightDirection;
uniform float u_limit;  
uniform float u_innerLimit; 
uniform float u_outerLimit;
        
void main()
{
    //fragColor = vec4(fragNormal,1.0);

    vec4 tex_col1 = texture(u_texture1, fragTexCoord);
    vec4 tex_col2 = texture(u_texture2, fragTexCoord);
    fragColor =  mix(mix(tex_col1, tex_col2, texturesMix), vec4(color, 1.0), colorMix);


    vec3 surfaceToLightDirection = v_surfaceToLight;
    vec3 surfaceToViewDirection = v_surfaceToView;
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    float dotFromDirection = dot(surfaceToLightDirection,-u_lightDirection);
    float limitRange = u_innerLimit - u_outerLimit;
    float inLight = clamp((dotFromDirection - u_outerLimit) / limitRange, 0.0, 1.0);

    float light = max(inLight *dot(fragNormal, surfaceToLightDirection),0.0);
    vec3 ambient = lAmbient * lColor;
    vec3 diffuse = light * lColor;
    vec3 r = reflect(u_lightDirection,fragNormal);
    float specular = inLight * pow(max(dot(v_surfaceToView, r),0.0), u_shininess);
    float specularStrength = 0.4f; //коэффициент блика объекта
    vec3 spec = specularStrength * specular * lColor;

    fragColor.rgb *=(diffuse+ambient);
    fragColor.rgb += spec;
}