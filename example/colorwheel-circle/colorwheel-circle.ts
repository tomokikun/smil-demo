
import { outputAsFile } from "../lib/file";
import { svg } from "../lib/svg";
import { random } from "../lib/random";

interface CircleProps {
  cx: number,
  cy: number,
  r: number,
  fill: string,
}

const circle = (props: CircleProps) => {
  const { cx, cy, r, fill } = props;

  return `<circle fill="${fill}" cx="${cx}" cy="${cy}" r="${r}" fill-opacity="30%">
    <animate attributeName="r" begin="${random(0, 20)}s" dur="${random(1, 10)}s" values="0;120;0" repeatCount="indefinite" fill="freeze"/>
  </circle>`
}

const noise = (max: number) => {
  return max * Math.sin(10 * Math.random() / max / 5.0);
}

async function main() {

  const cx = 200;
  const cy = 200;

  const convert = (r: number, theta: number): [number, number] => {
    return [r * Math.cos(theta), r * Math.sin(theta)]
  }

  const circles = Array(100)
    .fill(0)
    .map((_, i) => {
      const r = random(60, 160);
      const angle = random(0, 360);
      const theta = angle * Math.PI / 180;
      const [x, y] = convert(r, theta);
      return circle({
        cx: cx + x,
        cy: cy + y,
        r: 0,
        fill: `hsl(${angle},90%,50%)`,
      })
    }).join("")

  const centeredCircles = Array(100)
    .fill(0)
    .map((_, i) => {
      const angle = random(0, 360);
      return circle({
        cx: cx,
        cy: cy,
        r: 0,
        fill: `hsl(${angle},90%,50%)`,
      })
    }).join("")


  const generatedSvg = svg([
    circles,
    centeredCircles
  ].join(""))

  await outputAsFile("colorwheel-circle.svg", generatedSvg)
}


main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
