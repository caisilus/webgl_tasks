#version 300 es

precision mediump float;

in vec3 color;
uniform float colorMix;
in vec2 fragTexCoord;
in vec3 fragNormal;
out vec4 fragColor;
uniform sampler2D u_texture1;

//Параметры глобального света
uniform vec3 globalLightDirection;

//Параметры точечного света
in vec3[10] tolDirection;
uniform int num_lightsF;

//Параметры направленного света
in vec3[10] toslDirection;
uniform int num_spotlightsF;
uniform vec3[10] slDirection;
uniform float[10] slLimit;

uniform bool globalLight;
uniform bool pointLight;
uniform bool spotLight;
        
void main()
{
    vec4 tex_col1 = texture(u_texture1, fragTexCoord);
    fragColor =  mix(tex_col1, vec4(color, 1.0), colorMix);
    
    float diff = 0.2;
    if (globalLight)
    {
        vec3 ratio = globalLightDirection;
        ratio = normalize(ratio);
        float light = max(dot(fragNormal, ratio),0.0);
        diff += light;
    }
    if (pointLight)
    {
        for (int i = 0; i < num_lightsF; i++)
        {
            vec3 ratio = tolDirection[i];
            ratio = normalize(ratio);
            float light = max(dot(fragNormal, ratio),0.0);
            diff += light;
        }
    }
    if (spotLight)
    {
        for (int i = 0; i < num_spotlightsF; i++)
        {

            vec3 l = normalize(toslDirection[i]);
            vec3 d = normalize(slDirection[i]);
            float dotFromDirection = dot(l,-d);

            if (dotFromDirection >= slLimit[i]) 
            {
                vec3 ratio = toslDirection[i];
                ratio = normalize(ratio);
                float light = max(dot(fragNormal, ratio),0.0);
                diff += light;
            }
        }
    }
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
}