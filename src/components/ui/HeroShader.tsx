import { useEffect, useRef, useState } from 'react';

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

// Domain-warped fbm "liquid light" that bends around the pointer.
const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uLight;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = r * p * 2.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 m = (uMouse - 0.5 * uRes) / uRes.y;
  float d = length(p - m);
  p += (p - m) * 0.22 * exp(-d * 2.5);          // lens bulge at pointer
  float t = uTime;

  vec2 q = vec2(fbm(p * 1.4 + t * 0.06), fbm(p * 1.4 + vec2(5.2, 1.3) - t * 0.05));
  vec2 r = vec2(fbm(p * 1.4 + 3.5 * q + vec2(1.7, 9.2) + t * 0.08),
                fbm(p * 1.4 + 3.5 * q + vec2(8.3, 2.8) - t * 0.07));
  float f = fbm(p * 1.4 + 3.5 * r);

  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 col;
  if (uLight > 0.5) {
    // Light theme: pastel ink flowing on paper-white
    vec3 paper = vec3(0.975, 0.985, 0.98);
    vec3 tint = mix(vec3(0.45, 0.92, 0.74), vec3(0.55, 0.85, 0.98), clamp(length(q) * 0.7, 0.0, 1.0));
    tint = mix(tint, vec3(0.76, 0.66, 1.0), clamp(r.x * r.x * 1.3, 0.0, 1.0) * 0.6);
    float ink = clamp(f * f * 1.9 + 0.25 * exp(-d * 3.0), 0.0, 1.0);
    col = mix(paper, tint, ink * 0.75);
  } else {
    vec3 base    = vec3(0.012, 0.02, 0.03);
    vec3 emerald = vec3(0.06, 0.78, 0.52);
    vec3 cyan    = vec3(0.10, 0.70, 0.95);
    vec3 violet  = vec3(0.52, 0.30, 0.98);
    col = mix(base, emerald, clamp(f * f * 2.2, 0.0, 1.0));
    col = mix(col, cyan, clamp(length(q) * 0.55, 0.0, 1.0) * 0.55);
    col = mix(col, violet, clamp(r.x * r.x * 1.2, 0.0, 1.0) * 0.5);
    col *= (f * f * f + 0.55 * f * f + 0.45 * f) * 1.35;
    col += emerald * 0.22 * exp(-d * 3.5);
    col *= smoothstep(1.25, 0.25, length(uv - 0.5) * 1.6);
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Full-bleed GPU shader background. Renders at reduced resolution (smooth
 * gradients upscale cleanly), eases the pointer, pauses off-screen.
 */
export function HeroShader({ light = false }: { light?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const lightRef = useRef(light);
  const [failed, setFailed] = useState(false);
  lightRef.current = light;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) {
      setFailed(true);
      return;
    }
    // No real GPU (software rasteriser) → use the static CSS fallback instead.
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) {
      setFailed(true);
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uLight = gl.getUniformLocation(prog, 'uLight');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.matchMedia('(max-width: 767px)').matches;
    const scale = isSmall ? 0.33 : 0.42;
    let w = 1;
    let h = 1;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(r.width * scale));
      h = Math.max(1, Math.floor(r.height * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      if (!mouse.x) {
        mouse.x = mouse.tx = w * 0.62;
        mouse.y = mouse.ty = h * 0.55;
      }
    };
    resize();

    let raf = 0;
    let visible = true;
    const start = performance.now();

    let last = 0;
    const draw = (now: number) => {
      if (visible && !reduce) raf = requestAnimationFrame(draw);
      if (now - last < 21) return; // ~45fps cap: slow liquid motion, saves GPU/battery
      last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, reduce ? 8 : (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uLight, lightRef.current ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const kick = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) * scale;
      mouse.ty = (r.height - (e.clientY - r.top)) * scale;
    };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting && !document.hidden;
      if (visible) kick();
    });
    const onVis = () => {
      visible = !document.hidden;
      if (visible) kick();
    };
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) kick();
    });

    io.observe(canvas);
    ro.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  if (failed) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-background">
        <div className="hero-fallback-blob" style={{ background: `radial-gradient(closest-side, ${light ? 'rgba(52,211,153,.35)' : 'rgba(16,185,129,.55)'}, transparent)`, left: '45%', top: '5%' }} />
        <div className="hero-fallback-blob hero-fallback-blob-2" style={{ background: `radial-gradient(closest-side, ${light ? 'rgba(56,189,248,.28)' : 'rgba(34,211,238,.35)'}, transparent)`, left: '60%', top: '35%' }} />
        <div className="hero-fallback-blob hero-fallback-blob-3" style={{ background: `radial-gradient(closest-side, ${light ? 'rgba(167,139,250,.25)' : 'rgba(139,92,246,.4)'}, transparent)`, left: '10%', top: '40%' }} />
      </div>
    );
  }
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
