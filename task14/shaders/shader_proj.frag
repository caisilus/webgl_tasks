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
    float light = inLight *dot(fragNormal, surfaceToLightDirection);
    float specular = inLight * pow(dot(fragNormal, halfVector), u_shininess);

    fragColor.rgb *=light;
    fragColor.rgb += specular;
}