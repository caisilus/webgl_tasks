#version 300 es

precision mediump float;

in vec3 color;
in vec2 fragTexCoord;
in vec3 fragNormal;
out vec4 fragColor;
uniform sampler2D u_texture1;
uniform float colorMix;

in vec3 v_surfaceToView;

//Параметры глобального света
uniform vec3 globalLightDirection;
uniform vec3 globalLightAmbient;
uniform vec3 globalLightDiffuse;
uniform vec3 globalLightSpecular;

//Параметры точечного света
uniform int num_lightsF;
in vec3[10] tolDirection;
uniform vec3[10] lAmbient;
uniform vec3[10] lDiffuse;
uniform vec3[10] lSpecular;

uniform bool globalLight;
uniform bool pointLight;
uniform bool spotLight;

void main()
{
    vec4 tex_col1 = texture(u_texture1, fragTexCoord);
    fragColor =  mix(tex_col1, vec4(color, 1.0), colorMix);
    vec3 vfragNormal  = normalize(fragNormal);

    if (globalLight)
    {
        vec3 lightdir = normalize(globalLightDirection);
        vec3 r = normalize(-reflect(lightdir,vfragNormal));
        vec3 v = normalize(v_surfaceToView);

        vec3 ambient = globalLightAmbient;
        vec3 diffuse = globalLightDiffuse * max(dot(vfragNormal, lightdir),0.0);
        diffuse = clamp(diffuse, 0.0, 1.0);

        vec3 specular = globalLightSpecular * pow(max(dot(r,v),0.0), 10.0);
        specular = clamp(specular, 0.0, 1.0);

        fragColor.rgb *= (ambient + diffuse);
        fragColor.rgb += specular;
    }

    if (pointLight)
    {
        for (int i = 0; i < num_lightsF; i++)
        {
            vec3 lightdir = normalize(tolDirection[i]);
            vec3 r = normalize(-reflect(lightdir,vfragNormal));
            vec3 v = normalize(v_surfaceToView);

            vec3 ambient = lAmbient[i];
            vec3 diffuse = lDiffuse[i] * max(dot(vfragNormal, lightdir),0.0);
            diffuse = clamp(diffuse, 0.0, 1.0);

            vec3 specular = lSpecular[i] * pow(max(dot(r,v),0.0), 300.0);
            specular = clamp(specular, 0.0, 1.0);

            fragColor.rgb += fragColor.rgb * (ambient + diffuse);
            fragColor.rgb += specular;
        }
    }
}