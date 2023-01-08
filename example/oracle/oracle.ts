import { outputAsFile } from "../lib/file";
import { svg } from "../lib/svg";
import { eight } from "../eight/eight";

const random = (): number => {
  return Math.random();
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
  const visibleCircleRadius = 10 * random();
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
  })
}

async function main() {

  const counts = 300;
  const innerRadius = 50;

  const eights = Array(counts).fill(0)
    .map((_, i) => generateEight({
      id: i.toString(),
      cx: 200,
      cy: 200,
      r: 100 * random() + innerRadius,
      theta: 360 * random() * Math.PI / 180,
      strokeDuration: 30 * random() + 30,
      rotateDuration: 30 * random() + 30,
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
