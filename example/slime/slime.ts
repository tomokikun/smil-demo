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
  const visibleCircleRadius = random(2, 50);
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

  const counts = 10;
  const innerRadius = 30;

  const baseMaxDuration = 30 * 60; // sec

  const randomDuration = () => random(baseMaxDuration * 0.1, baseMaxDuration);

  const eights = Array(counts).fill(0)
    .map((_, i) => generateEight({
      id: i.toString(),
      cx: 200,
      cy: 200,
      r: random(innerRadius, 50),
      theta: random(0, 360) * Math.PI / 180,
      strokeDuration: randomDuration(),
      rotateDuration: randomDuration(),
    }))
    .join("");

  const filter = `
  <filter id="s44">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.05"
      numOctaves="0.5"
      result="turbulence" />
    <feDisplacementMap
      in2="turbulence"
      in="SourceGraphic"
      scale="50"
      xChannelSelector="R"
      yChannelSelector="G" />
    <feGaussianBlur stdDeviation="0 0.1" />
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
