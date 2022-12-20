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
uniform int f;
uniform vec3 lColor;
uniform vec3 lAmbient;
uniform vec3 u_lightDirection;
        
void main()
{
    //fragColor = vec4(fragNormal,1.0);

    vec4 tex_col1 = texture(u_texture1, fragTexCoord);
    vec4 tex_col2 = texture(u_texture2, fragTexCoord);
    fragColor =  mix(mix(tex_col1, tex_col2, texturesMix), vec4(color, 1.0), colorMix);
    vec3 ratio = v_surfaceToLight;
    if (f==0){
         ratio = normalize(u_reverseLightDirection);
    }

    float light = max(dot(fragNormal, ratio),0.0);
    vec3 ambient = lAmbient * lColor;
    vec3 diffuse = light * lColor;

    vec3 r = reflect(u_lightDirection,fragNormal);
    float specular = 0.0;
    if (light > 0.0) {
        specular = pow(max(dot(v_surfaceToView, r),0.0), u_shininess);
    }
    float specularStrength = 0.f; //коэффициент блика объекта
    vec3 spec = specularStrength * specular * lColor;
    fragColor.rgb *=(diffuse+ambient);
    fragColor.rgb += spec;

}