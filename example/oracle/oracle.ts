import { outputAsFile } from "../lib/file";
import { svg } from "../lib/svg";
import { eight } from "../eight/eight";

/**
 * `min`以上`max`以下の乱数を生成
 */
const random = (min: number, max: number): number => {
  return max * Math.random() + min;
}

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

  const counts = 100;
  const innerRadius = 50;

  const eights = Array(counts).fill(0)
    .map((_, i) => generateEight({
      id: i.toString(),
      cx: 200,
      cy: 200,
      r: random(innerRadius, 100),
      theta: random(0, 360) * Math.PI / 180,
      strokeDuration: random(30, 100),
      rotateDuration: random(30, 80),
    }))
    .join("");

  const g = (ch?: any) => {
    return [
      "<g>",
      eights,
      "</g>"
    ].join("")
  }

  const generatedSvg = svg(g())

  await outputAsFile("oracle.svg", generatedSvg)
}


main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
