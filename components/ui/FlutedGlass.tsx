"use client";
import React, { useEffect, useRef } from "react";

interface FlutedGlassProps {
  className?: string;
  colors?: string[]; // hex colors, default: ["#dae3ff", "#fffefb", "#ffffff", "#fffefb", "#ffffff"]
  speed?: number; // default: 0.44
  flutes?: number; // default: 8
  fluteAngle?: number; // default: 140
  distortion?: number; // default: 1.27
  highlight?: number; // default: 0.66
  blur?: number; // default: 1.24
  angle?: number; // default: 45
  grain?: number; // default: 0.18
  mouse?: number; // 0 or 1
}

export const FlutedGlass: React.FC<FlutedGlassProps> = ({
  className = "",
  colors = ["#dae3ff", "#fffefb", "#ffffff", "#fffefb", "#ffffff"],
  speed = 0.44,
  flutes = 8,
  fluteAngle = 140,
  distortion = 1.27,
  highlight = 0.66,
  blur = 1.24,
  angle = 45,
  grain = 0.18,
  mouse = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) {
      console.warn("WebGL not supported.");
      return;
    }

    // Helper to convert hex to RGB vec3
    const hexToRgb = (hex: string): [number, number, number] => {
      const clean = hex.replace("#", "");
      const r = parseInt(clean.substring(0, 2), 16) / 255;
      const g = parseInt(clean.substring(2, 4), 16) / 255;
      const b = parseInt(clean.substring(4, 6), 16) / 255;
      return [isNaN(r) ? 1 : r, isNaN(g) ? 1 : g, isNaN(b) ? 1 : b];
    };

    const parsedColors = colors.map(hexToRgb);
    while (parsedColors.length < 5) {
      parsedColors.push(parsedColors[parsedColors.length - 1] || [1, 1, 1]);
    }

    // Vertex Shader
    const vsSource = `
      attribute vec2 position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader
    const fsSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      
      uniform float u_speed;
      uniform float u_flutes;
      uniform float u_fluteAngle;
      uniform float u_distortion;
      uniform float u_highlight;
      uniform float u_blur;
      uniform float u_angle;
      uniform float u_grain;
      
      uniform vec3 u_colors[5];

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                   mix(mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }

      vec3 getBgColor(vec2 uv, float time) {
        vec2 uv1 = uv * 1.2 + vec2(time * 0.04 * u_speed, time * 0.02 * u_speed);
        vec2 uv2 = uv * 1.8 - vec2(time * 0.03 * u_speed, time * 0.05 * u_speed);
        
        uv1 += u_mouse * 0.05;
        uv2 -= u_mouse * 0.03;

        float n = noise(uv1) * 0.65 + noise(uv2) * 0.35;
        
        vec3 col = vec3(1.0);
        if (n < 0.25) {
          col = mix(u_colors[0], u_colors[1], n / 0.25);
        } else if (n < 0.5) {
          col = mix(u_colors[1], u_colors[2], (n - 0.25) / 0.25);
        } else if (n < 0.75) {
          col = mix(u_colors[2], u_colors[3], (n - 0.5) / 0.25);
        } else {
          col = mix(u_colors[3], u_colors[4], (n - 0.75) / 0.25);
        }
        return col;
      }

      void main() {
        // Read varying v_texCoord and copy it to a modifiable local variable
        vec2 uv = vec2(v_texCoord.x, 1.0 - v_texCoord.y);
        
        vec2 aspectCorrect = vec2(uv.x * (u_resolution.x / u_resolution.y), uv.y);
        float fAngleRad = u_fluteAngle * 3.14159265 / 180.0;
        float rotX = aspectCorrect.x * cos(fAngleRad) - aspectCorrect.y * sin(fAngleRad);
        
        float fluteWidth = u_flutes * 2.0;
        float wavePhase = rotX * fluteWidth;
        
        float wave = sin(wavePhase);
        float derivative = cos(wavePhase);

        vec2 dirPerp = vec2(-sin(fAngleRad), cos(fAngleRad));
        float blurScale = mix(0.5, 2.0, u_blur / 2.0);
        vec2 distortedUv = uv + dirPerp * derivative * 0.018 * u_distortion * blurScale;

        vec3 col = getBgColor(distortedUv, u_time);

        vec3 normal = normalize(vec3(derivative * 0.45, 0.0, 1.0 - abs(wave) * 0.1));
        float lightAngleRad = u_angle * 3.14159265 / 180.0;
        vec3 lightDir = normalize(vec3(cos(lightAngleRad), sin(lightAngleRad), 0.7));
        
        lightDir.xy += (u_mouse - vec2(0.5)) * 0.25;
        lightDir = normalize(lightDir);

        float diff = max(dot(normal, lightDir), 0.0);
        float spec = pow(diff, 18.0) * u_highlight * 0.45;
        float edge = pow(1.0 - abs(normal.z), 3.0) * u_highlight * 0.12;

        col += vec3(spec + edge);
        col = mix(col, vec3(1.0), 0.05);

        float grainVal = hash(uv + vec2(u_time * 0.01, u_time * 0.02)) * u_grain * 0.07;
        col += vec3(grainVal - (u_grain * 0.035));

        gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation log:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Shader link log:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uSpeed = gl.getUniformLocation(program, "u_speed");
    const uFlutes = gl.getUniformLocation(program, "u_flutes");
    const uFluteAngle = gl.getUniformLocation(program, "u_fluteAngle");
    const uDistortion = gl.getUniformLocation(program, "u_distortion");
    const uHighlight = gl.getUniformLocation(program, "u_highlight");
    const uBlur = gl.getUniformLocation(program, "u_blur");
    const uAngle = gl.getUniformLocation(program, "u_angle");
    const uGrain = gl.getUniformLocation(program, "u_grain");
    
    gl.uniform1f(uSpeed, speed);
    gl.uniform1f(uFlutes, flutes);
    gl.uniform1f(uFluteAngle, fluteAngle);
    gl.uniform1f(uDistortion, distortion);
    gl.uniform1f(uHighlight, highlight);
    gl.uniform1f(uBlur, blur);
    gl.uniform1f(uAngle, angle);
    gl.uniform1f(uGrain, grain);

    const uColors = gl.getUniformLocation(program, "u_colors");
    const flatColors = new Float32Array(parsedColors.flat());
    gl.uniform3fv(uColors, flatColors);

    // Resize function using absolute bounds
    const resize = () => {
      const parent = containerRef.current;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    // Set up ResizeObserver to size correctly on layout mounts
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      if (mouse !== 1) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
        mouseRef.current.targetY = 1.0 - (e.clientY - rect.top) / rect.height;
      }
    };

    if (mouse === 1) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    let animFrameId: number;
    const startTime = performance.now();

    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000.0;
      gl.uniform1f(uTime, elapsed);

      if (mouse === 1) {
        const m = mouseRef.current;
        m.x += (m.targetX - m.x) * 0.08;
        m.y += (m.targetY - m.y) * 0.08;
        gl.uniform2f(uMouse, m.x, m.y);
      } else {
        gl.uniform2f(uMouse, 0.5, 0.5);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      if (mouse === 1) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
    };
  }, [colors, speed, flutes, fluteAngle, distortion, highlight, blur, angle, grain, mouse]);

  return (
    <div ref={containerRef} className={`w-full h-full relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block absolute inset-0"
        style={{ pointerEvents: "none", display: "block" }}
      />
    </div>
  );
};
