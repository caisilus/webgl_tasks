#version 300 es

precision mediump float;

in vec2 fragTexCoord;
in vec3 fragNormal;
out vec4 fragColor;
uniform sampler2D u_texture1;

in vec3 v_surfaceToView;

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
void main (void)
{
    vec4 tex_col1 = texture(u_texture1, fragTexCoord);
    const vec4 color0 = vec4 (0.99, 0, 0.64, 1);
    const vec4 color2 = vec4 (0, 0.04, 0.5, 1);


    vec3 vfragNormal  = normalize(fragNormal);
    vec4 new_color = tex_col1;
    //Если освещение глобальное то можно просто посчитать вектор до источника света и применить формулу
    if (globalLight)
    {
        vec3 l = normalize(globalLightDirection);
        vec4 diff = color0 * max ( dot ( vfragNormal, l ), 0.0 ) + color2 * max ( dot ( vfragNormal, -l ), 0.0 );
        new_color += diff;
    }
    if (pointLight)
    {
        //Иначе считаем всевозможные источники точечного света
        for (int i = 0; i < num_lightsF; i++)
        {
            vec3 l = normalize(tolDirection[i]);
            vec4 diff = color0 * max ( dot ( vfragNormal, l ), 0.0 ) + color2 * max ( dot ( vfragNormal, -l ), 0.0 );
            new_color += diff;
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
                vec4 diff = color0 * max ( dot ( vfragNormal, l ), 0.0 ) + color2 * max ( dot ( vfragNormal, -l ), 0.0 );
                new_color += diff;
            }
        }
    }

    fragColor = new_color;
}