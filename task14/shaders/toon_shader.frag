#version 300 es

precision mediump float;

in vec3 color;
in vec2 fragTexCoord;
in vec3 fragNormal;
out vec4 fragColor;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;
uniform sampler2D u_texture1;

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
    vec4 tex_col1 = texture(u_texture1, fragTexCoord);
    fragColor =  mix(tex_col1, vec4(color, 1.0), colorMix);
    
    vec3 ratio = v_surfaceToLight;
    if (f==0){
        ratio = normalize(u_reverseLightDirection);
    }

    float light = max(dot(fragNormal, ratio),0.0);
    float diff = 0.2 + light;
    
    if (diff < 0.4) {
        fragColor.rgb *= 0.3;
    }
    else 
    if (diff < 0.5) {
        fragColor.rgb *= 0.5;
    }
    else
    if (diff < 0.7) {
        fragColor.rgb *= 1.0;
    }
    else{
        fragColor.rgb *= 1.3;
    }
    // vec3 ambient = lAmbient * lColor;
    // vec3 diffuse = light * lColor;

    // fragColor.rgb *= (diffuse + ambient);
}