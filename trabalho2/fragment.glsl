#version 300 es

// BASE 1 --> https://www.shadertoy.com/view/4tcGDr
// BASE 2 --> https://github.com/GabrielRocha1031/Trabalho2_CG
// FORMULAS --> https://iquilezles.org/articles/distfunctions/

precision highp float;

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;

vec3 lightPosition = vec3(-7., 15., 2.0);
vec3 lightColor = vec3(0.6, 0.6, 0.6);
float lightIntensity = 120.0;
float lightAttenuation = 0.5;

// we need to declare an output for the fragment shader
out vec4 outColor;

const float DEF = 0.25; // smooth deformation

mat3 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(vec3(1, 0, 0), vec3(0, c, -s), vec3(0, s, c));
}

mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(vec3(c, 0, s), vec3(0, 1, 0), vec3(-s, 0, c));
}

float intersectSDF(float distA, float distB) {
    return max(distA, distB);
}

float unionSDF(float distA, float distB) {
    return min(distA, distB);
}

float differenceSDF(float distA, float distB) {
    return max(distA, -distB);
}

float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
}

float opSmoothSubtraction(float d1, float d2) {
    float h = clamp(0.5 - 0.5 * (d2 + d1) / DEF, 0.0, 1.0);
    return mix(d2, -d1, h) + DEF * h * (1.0 - h);
}

float opSmoothIntersection(float d1, float d2) {
    float h = clamp(0.5 - 0.5 * (d2 - d1) / DEF, 0.0, 1.0);
    return mix(d2, d1, h) + DEF * h * (1.0 - h);
}

float boxSDF(vec3 p, vec3 size) {
    vec3 d = abs(p) - (size / 2.0);
    float insideDistance = min(max(d.x, max(d.y, d.z)), 0.0);
    float outsideDistance = length(max(d, 0.0));

    return insideDistance + outsideDistance;
}

float sphereSDF(vec3 p, float r) {
    return length(p) - r;
}

float cylinderSDF(vec3 p, float h, float r) {
    float inOutRadius = length(p.xy) - r;
    float inOutHeight = abs(p.z) - h / 2.0;
    float insideDistance = min(max(inOutRadius, inOutHeight), 0.0);
    float outsideDistance = length(max(vec2(inOutRadius, inOutHeight), 0.0));
    return insideDistance + outsideDistance;
}

float sdCone(vec3 p, vec3 a, vec3 b, float ra, float rb) {
    float rba = rb - ra;
    float baba = dot(b - a, b - a);
    float papa = dot(p - a, p - a);
    float paba = dot(p - a, b - a) / baba;
    float x = sqrt(papa - paba * paba * baba);
    float cax = max(0.0, x - ((paba < 0.5) ? ra : rb));
    float cay = abs(paba - 0.5) - 0.5;
    float k = rba * rba + baba;
    float f = clamp((rba * (x - ra) + paba * baba) / k, 0.0, 1.0);
    float cbx = x - ra - f * rba;
    float cby = paba - f;
    float s = (cbx < 0.0 && cay < 0.0) ? -1.0 : 1.0;
    return s * sqrt(min(cax * cax + cay * cay * baba, cbx * cbx + cby * cby * baba));
}

float sdTriPrism(vec3 p, vec2 h) {
    vec3 q = abs(p);
    return max(q.z - h.y, max(q.x * 0.866025 + p.y * 0.5, -p.y) - h.x * 0.5);
}

float smoothMax(float a, float b, float k) {
    return log(exp(k * a) + exp(k * b)) / k;
}

float smoothMin(float a, float b, float k) {
    return -smoothMax(-a, -b, k);
}

// vec3 baseColor;
// float sceneSDF(vec3 pos) {  
vec4 scene(vec3 pos) {
    const int len = 8;
    float shapes[len];
    vec3 colors[len];

    shapes[0] = pos.z + 30.; //céu
    shapes[1] = pos.y + 2.; //chao
    colors[0] = vec3(0.32, 0.82, 0.84);
    colors[1] = vec3(0.09, 0.45, 0.15);

    float walls = boxSDF(pos + vec3(0., .9, 0.), vec3(2.5, 2.2, 4.));
    float roof = sdTriPrism(pos + vec3(0., -1.1, 0.), vec2(1.8, 2.2));

    float openings = boxSDF(pos + vec3(1.15, 1.5, .0), vec3(.1, 1., .5)); // porta
    openings = unionSDF(openings, boxSDF(pos + vec3(1.05, 0.4, 1.2), vec3(.2, 0.5, .5)));
    openings = unionSDF(openings, boxSDF(pos + vec3(1.05, 0.4, -1.2), vec3(.2, 0.5, .5)));
    openings = unionSDF(openings, boxSDF(pos + vec3(-1.05, 0.6, 1.), vec3(.2, 0.75, .75)));
    openings = unionSDF(openings, boxSDF(pos + vec3(-1.05, 0.6, -1.), vec3(.2, 0.75, .75)));

    // float distortionLevel = sin(.4*iTime)*5.2;
    // float distortion = (sin(distortionLevel * pos.x) * 
    //                     sin(distortionLevel * pos.z) * 
    //                     sin(distortionLevel * pos.y) * 0.15);

    float chimney = boxSDF(pos + vec3(0.5, -1.9, 1.7), vec3(.4, 2.5, .4));

    float distortionLevel = cos(.4 * iTime) + 5.2;
    float distortion = (sin(distortionLevel * pos.x - 1.) *
        cos(distortionLevel * pos.z + 1.) *
        sin(distortionLevel * pos.y) * 0.15);

    float smoke = sphereSDF(pos + vec3(0.5, -3.3, 1.65), 0.05);
    smoke = opSmoothUnion(smoke, sphereSDF(pos + vec3(0.5, -3.75, 1.65), 0.12), 0.75);
    smoke = opSmoothUnion(smoke, sphereSDF(pos + vec3(0.85, -4.2, 1.65), 0.08), .75) + distortion;

    // float up = opSmoothUnion(chimney, smoke1);

    shapes[2] = opSmoothUnion(roof, chimney, .35);
    colors[2] = vec3(0.52, 0.03, 0.02);

    shapes[3] = smoke;
    colors[3] = vec3(0.72, 0.72, 0.72);

    shapes[4] = walls;
    colors[4] = vec3(.9, 0.33, 0.56);

    shapes[5] = openings;
    colors[5] = vec3(1., 0.2, 0.2);

    //  distortionLevel = cos(.4*iTime)+5.2;
    //  distortion = (sin(distortionLevel * pos.x-1.) * 
    //                     cos(distortionLevel * pos.z+1.) * 
    //                     sin(distortionLevel * pos.y) * 0.15);

    float folhas1 = sphereSDF(pos + vec3(3.1, -0.7, 3.4), 0.7);
    float folhas = opSmoothUnion(folhas1, sphereSDF(pos + vec3(3.8, -0.2, 3.), 0.65), 0.45);
    folhas = opSmoothUnion(folhas, sphereSDF(pos + vec3(3.2, -0.6, 2.3), 0.65), 0.45);
    folhas = opSmoothUnion(folhas, sphereSDF(pos + vec3(3.6, -1.3, 2.7), 0.6), 0.45);
    folhas = folhas + distortion;

    float tronco1 = sdCone(pos + vec3(3.5, 2., 2.8), vec3(0.), vec3(0.0, 1.5, 0.0), 0.4, 0.01);
    vec3 posTronco2 = vec3(pos + vec3(3.5, -0.2, 2.8)) * rotateX(9.42);
    float tronco2 = sdCone(posTronco2, vec3(-0.15, -.2, -.1), vec3(0.0, 1.5, 0.0), 0.3, 0.1);

    shapes[6] = folhas;
    shapes[7] = opSmoothUnion(tronco1, tronco2, 0.45);

    colors[6] = colors[1];
    colors[7] = vec3(0.46, 0.3, 0.22);

    // shapes[7] = smoke1;
    // colors[7] = colors[1];

    float d1 = shapes[0];
    vec3 color = colors[0];
    float distance = shapes[0];

    for(int i = 1; i < len; i++) {
        float d2 = shapes[i];
        float mix_factor = d1 / (d2 + d1);
        color = mix(color, colors[i], mix_factor);
        d1 = mix_factor;
        distance = opSmoothUnion(distance, d2, .2);
        // distance = min(distance, d2);
    }

    return vec4(color, distance);
}

vec3 estimateNormal(vec3 p) {
    float eps = 0.005;
    float dx = scene(vec3(p.x + eps, p.y, p.z)).w - scene(vec3(p.x - eps, p.y, p.z)).w;
    float dy = scene(vec3(p.x, p.y + eps, p.z)).w - scene(vec3(p.x, p.y - eps, p.z)).w;
    float dz = scene(vec3(p.x, p.y, p.z + eps)).w - scene(vec3(p.x, p.y, p.z - eps)).w;
    return normalize(vec3(dx, dy, dz));
}

float calculateLight(vec3 pointPos, vec3 pointNormal) {
    // calcula a direção da luz em relação ao ponto
    vec3 lightDirection = normalize(lightPosition - pointPos);

    // calcula o produto escalar entre a direção da luz e a normal do ponto
    float diff = max(dot(pointNormal, lightDirection), .2);

    // calcula a atenuação da luz em função da distância
    float distance = length(lightPosition - pointPos);
    // float attenuation = 0.9 / (1.5 + lightAttenuation * distance * distance);
    float attenuation = 0.18 / (0.5 + lightAttenuation * distance);

    // calcula a intencidade da specular
    vec3 reflectedDirection = reflect(-lightDirection, pointNormal);
    float cosAngle = max(dot(reflectedDirection, pointNormal), 0.85);
    float specularIntensity = pow(cosAngle, 55.);

    // retorna a quantidade de luz que atinge o ponto
    return lightIntensity * attenuation * (diff + specularIntensity);
}

float calculateShadow(vec3 pointPos) {
    // Calcula a direção do raio
    vec3 shadowDirection = normalize(lightPosition - pointPos);
    float distanceLength = length(pointPos - lightPosition);
    float radius = 0.1;

    // fracao de luz visivel
    float lf = radius * distanceLength;

    // distancia percorrida
    float dt = 0.01;

    for(int i = 0; i < 100; i++) {
        vec3 currentPos = pointPos + shadowDirection * dt;
        float currentDistance = scene(currentPos).w;
        if(currentDistance < -radius) {
            return 0.0;
            break;
        }

        lf = min(lf, currentDistance / dt);
        dt += currentDistance;

        if(dt > distanceLength) {
            break;
        }
    }

    lf = clamp((lf * distanceLength + radius) / (2.0 * radius), 0.0, 1.0);
    lf = smoothstep(0.0, 1.0, lf);

    return lf;
}

vec3 raymarch(vec3 ro, vec3 rd) {
    float t = 0.0;
    float d = 0.0;  //distancia
    vec3 color;
    vec3 reflection;
    float lightAmount;
    float shadow = 0.5;
    float specular = 25.0;
    float shininess = 1000.0; // ajuste a intensidade do brilho

    for(int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        vec4 sc = scene(p);
        d = sc.w;
        color = sc.xyz;

        t += d;
        if(d < 0.001 || t > 100.0) {

            vec3 normal = estimateNormal(p);
            vec3 viewDir = normalize(-rd);
            vec3 lightDir = normalize(lightPosition - p);
            vec3 halfwayDir = normalize(lightDir + viewDir);
            lightAmount = calculateLight(p, normal);
            shadow = calculateShadow(p);

            // cálculo da reflexão especular
            float specularStrength = pow(max(dot(normal, halfwayDir), 0.0), shininess);
            specular = lightAmount * specularStrength;
            reflection = mix(color, vec3(1.0), specular); // a cor da reflexão é branca

            break;
        }
    }

    return mix(color, reflection, specular) * lightAmount * lightColor * shadow;
}

mat3 setCamera(in vec3 ro, in vec3 ta, float cr) {
    vec3 cw = normalize(ta - ro);
	// vec3 cp = vec3(sin(cr), cos(cr),0.0);
    vec3 cp = vec3(0.0, 1.0, 0.0);
    vec3 cu = normalize(cross(cw, cp));
    vec3 cv = (cross(cu, cw));
    return mat3(cu, cv, cw);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec3 ta = vec3(0.0, 0.0, 0.0);
    vec3 ro = ta + vec3(-15.0, 0.0, 7.0);
    // camera-to-world transformation
    mat3 ca = setCamera(ro, ta, 10.0);

    vec3 tot = vec3(-0.1);
    vec2 p = (2. * fragCoord - iResolution.xy) / iResolution.y;
    const float fl = 2.5; // focal length
    vec3 rd = ca * normalize(vec3(p, fl)); // ray direction

    // ray differentials
    vec2 px = (2.0 * (fragCoord + vec2(1.0, 0.0)) - iResolution.xy) / iResolution.y;
    vec2 py = (2. * (fragCoord + vec2(0.0, 1.0)) - iResolution.xy) / iResolution.y;
    vec3 rdx = ca * normalize(vec3(px, fl));
    vec3 rdy = ca * normalize(vec3(py, fl));

    vec3 col = raymarch(ro, rd); // render	

    // gain
    // col = col*3.0/(2.5+col);

    // gamma
    col = pow(col, vec3(0.4545));
    tot += col;
    fragColor = vec4(tot, 1.0);
}

void main() {
    mainImage(outColor, gl_FragCoord.xy);
}