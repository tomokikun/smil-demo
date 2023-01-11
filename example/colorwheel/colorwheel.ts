
import { outputAsFile } from "../lib/file";
import { svg } from "../lib/svg";

interface CircleProps {
  cx: number,
  cy: number,
  r: number,
  fill: string,
}

const circle = (props: CircleProps) => {
  const { cx, cy, r, fill } = props;

  return `<circle fill="${fill}" cx="${cx}" cy="${cy}" r="${r}"/>`
}

const noise = (max: number) => {
  return max * Math.sin(10 * Math.random() / max / 5.0);
}

async function main() {

  const cx = 100;
  const cy = 40;
  const visibleCircleRadius = 10;

  const circles = Array(100)
    .fill(0)
    .map((_, i) => { return Array(360).fill(0) })
    .map((row, i) => {
      return row.map((_, j) => {
        return circle({
          cx: cx + i * 2 + noise(5),
          cy: cy + j + noise(5),
          r: visibleCircleRadius + noise(5),
          fill: `hsl(${j / 2.0 + noise(5)},90%,${i}%)`
        })
      }).join("")
    }).join("")

  const generatedSvg = svg(circles)

  await outputAsFile("colorwheel.svg", generatedSvg)
}


main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
