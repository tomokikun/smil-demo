import { outputAsFile } from "../lib/file";
import { svg } from "../lib/svg";
import { eight } from "../eight/eight";
import { random } from "../lib/random";


const defs = () => {
  return `<defs>
    <linearGradient id="linear_gradient">
      <stop offset="0%" stop-color="orange" />
      <stop offset="100%" stop-color="teal" />
    </linearGradient>
  </defs>`
}

interface EightProps {
  id: string,
  cx: number,
  cy: number,
  r: number,
  theta: number,
  strokeDuration: number,
  rotateDuration: number,
}

const generateEight = (props: EightProps): string => {
  const { id, cx, cy, r, theta, strokeDuration, rotateDuration } = props;

  const x = cx + r * Math.cos(theta);
  const y = cy + r * Math.sin(theta);
  const visibleCircleRadius = random(2, 15);
  const circleCount = 2;
  const baseColor = "url(#linear_gradient)";

  return eight({
    id,
    cx: x,
    cy: y,
    visibleCircleRadius,
    circleCount,
    baseColor,
    strokeDuration,
    rotateDuration,
    defs: defs()
  })
}

async function main() {

  const counts = 80;
  const innerRadius = 50;

  const eights = Array(counts).fill(0)
    .map((_, i) => generateEight({
      id: i.toString(),
      cx: 200,
      cy: 200,
      r: random(innerRadius, 100),
      theta: random(0, 360) * Math.PI / 180,
      strokeDuration: random(10, 300),
      rotateDuration: random(10, 100),
    }))
    .join("");

  const filter = `
  <filter id="s44">
    <feTurbulence
      type="turbulence"
      baseFrequency="0.05"
      numOctaves="2"
      result="turbulence" />
    <feDisplacementMap
      in2="turbulence"
      in="SourceGraphic"
      scale="80"
      xChannelSelector="R"
      yChannelSelector="G" />
    <feGaussianBlur stdDeviation="0.1" />
  </filter>
  `
  const g = (ch?: any) => {
    return [
      '<g filter="url(#s44)">',
      filter,
      eights,
      "</g>",
    ].join("")
  }

  const generatedSvg = svg(g())

  await outputAsFile("slime.svg", generatedSvg)
}


main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
