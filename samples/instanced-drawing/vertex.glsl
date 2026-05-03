#version 300 es

in vec3 a_coords;
in float a_size;
in vec3 a_offset;
in vec2 a_texCoords;
uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_camera;
uniform bool u_hasWind;
uniform bool u_isBillboard;
uniform float u_time;
uniform float u_fogStart;
uniform float u_fogEnd;
out vec2 v_texCoords;
out float v_fogFactor;



// 1. Pseudo-random hash function
// Returns a deterministic 2D vector based on grid coordinates
vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

// 2. Tileable 2D Perlin Noise
// 'p' is the coordinate, 'period' is the tiling size
float pnoise(vec2 p, vec2 period) {
    vec2 pi = floor(p);       // Integer part (Grid cell)
    vec2 pf = p - pi;         // Fractional part (Position within cell)

    // Smoothstep for non-linear interpolation
    vec2 w = pf * pf * (3.0 - 2.0 * pf); 

    // Wrap the integer coordinates using mod() to make it tileable
    vec2 pi0 = mod(pi, period);
    vec2 pi1 = mod(pi + vec2(1.0), period);

    // Calculate gradients at the 4 corners of the wrapped cell
    float x00 = dot(hash(pi0), pf);
    float x10 = dot(hash(vec2(pi1.x, pi0.y)), pf - vec2(1.0, 0.0));
    float x01 = dot(hash(vec2(pi0.x, pi1.y)), pf - vec2(0.0, 1.0));
    float x11 = dot(hash(pi1), pf - vec2(1.0, 1.0));

    // Interpolate along x, then y
    float k0 = mix(x00, x10, w.x);
    float k1 = mix(x01, x11, w.x);
    return mix(k0, k1, w.y);
}


vec2 windVector(vec2 instanceOffset) {
    vec2 windDir = normalize(vec2(1.0, 0.5)); 
    float windSpeed = 2.0;
    
    // Scale down world coordinates so the noise pattern covers a larger area
    float noiseScale = 0.05; 
    
    // The tiling period (must be an integer). 
    // A period of 10.0 means the noise repeats every 10 "units" of your scaled UVs.
    vec2 tilePeriod = vec2(10.0, 10.0); 
    
    // Calculate scrolling coordinates based on instance position and time
    vec2 windUV = (instanceOffset * noiseScale) + (windDir * u_time * windSpeed);
    
    // --- Procedural Fetch ---
    // Get base wind intensity [-1.0 to 1.0]
    float noiseValue = pnoise(windUV, tilePeriod);
    
    // Optional: Add a second layer of noise (fractal brownian motion) for turbulence
    float turbulence = pnoise(windUV * 2.0, tilePeriod * 2.0) * 0.5;
    noiseValue += turbulence;
    
    // Normalize noise to [0.0, 1.0] to prevent the wind from blowing backwards
    float windIntensity = (noiseValue + 1.0) * 0.5; 
    
    // Scale intensity by a global multiplier
    float windStrength = 0.04;
    vec2 windVector = windDir * windIntensity * windStrength;
    return windVector;
}




void main() {
    vec3 localCoords = a_coords;
    if (u_hasWind) {
        vec2 windVector = windVector(a_offset.xz);
        localCoords.xz += (localCoords.y * localCoords.y) * windVector;
    }

    vec3 scaledCoords = localCoords * a_size;
    vec3 finalCoords = scaledCoords + a_offset;
    if (u_isBillboard) {
        // Billboard axial: rota apenas no eixo Y para preservar verticalidade.
        vec3 toCamera = u_camera[3].xyz - a_offset;
        toCamera.y = 0.0;
        vec3 cameraForward = normalize(toCamera);
        vec3 cameraRight = normalize(cross(vec3(0.0, 1.0, 0.0), cameraForward));
        vec3 cameraUp = vec3(0.0, 1.0, 0.0);
        finalCoords = a_offset
            + cameraRight * scaledCoords.x
            + cameraUp * scaledCoords.y
            + cameraForward * scaledCoords.z;
    }
    vec4 viewPosition = u_view * vec4(finalCoords, 1.0);
    float distance = length(viewPosition.xyz);
    v_fogFactor = clamp((u_fogEnd - distance) / (u_fogEnd - u_fogStart), 0.0, 1.0);
    
    gl_Position = u_projection * viewPosition;
    v_texCoords = a_texCoords;
}


