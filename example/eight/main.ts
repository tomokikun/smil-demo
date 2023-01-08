import { outputAsFile } from "../lib/file";
import { svg } from "../lib/svg";

/**
interface SvgCompInterface {
  prefix: string;
  suffix: string;
  children: SvgCompInterface[];
  append(elm: SvgCompInterface): void;
  build(): string; 
}

class SvgComponent implements SvgCompInterface {
  prefix: string = "";
  suffix: string = "";
  children: SvgComponent[] = [];

  append(elm: SvgComponent): void {
    this.children.push(elm)
  }

  build(): string {
    return this.prefix + this.children.map((child) => {child.build()}).join("") + this.suffix;
  }
}

const buildSvg = (svg: SvgComponent) => {
  return svg.build()
}
 */

const defs = () => {
  return `<defs>
    <linearGradient id="linear_gradient">
      <stop offset="0%" stop-color="lightblue" />
      <stop offset="100%" stop-color="lightpink" />
    </linearGradient>
  </defs>`
}

interface CircleProps {
  cx: number,
  cy: number,
  r: number,
  fill: string, //  = "url(#linear_gradient)",
}

const circle = (props: CircleProps) => {
  const { cx, cy, r, fill } = props;
  return `<circle fill="${fill}" cx="${cx}" cy="${cy}" r="${r}"></circle>`
}

interface MotionPathProps {
  x1: number, // pathの交点のx座標
  y1: number, // pathの交点のy座標
  rx: number,
  ry: number,
  xRotation: number,
  // largeArcFlag: number,
  // sweepFlag: number,
  // fill: string, //  = "url(#linear_gradient)",
}

const motionPath = (props: MotionPathProps) => {
  const { x1, y1, rx, ry, xRotation } = props;

  /**
   * d="M ${x1},${y1}  // 円の中心の絶対座標に移動
      a ${rx},${ry} ${xRotation} 0 0 ${- 2 * rx}, 0 // pathが不連続にならないように半円を描く
      a ${rx},${ry} ${xRotation} 0 0 ${2 * rx}, 0
      a ${rx},${ry} ${xRotation} 0 0 ${- 2 * rx}, 0
      a ${rx},${ry} ${xRotation} 0 0 ${2 * rx}, 0
   */

  return `<path id="motion_path"
      d="M ${x1},${y1}
      a ${rx},${ry} ${xRotation} 0 0 0,${- 2 * ry}
      a ${rx},${ry} ${xRotation} 0 0 0,${2 * ry}
      a ${rx},${ry} ${xRotation} 0 1 0,${2 * ry}
      a ${rx},${ry} ${xRotation} 0 1 0,${- 2 * ry}"
      stroke-linecap="round"
      fill="transparent" />`
}

interface AnimatedStrokeProps {
  stroke: string, //  = "url(#linear_gradient)",
}

const animatedStroke = (props: AnimatedStrokeProps) => {
  const { stroke } = props;
  return `<use stroke="url(#linear_gradient)" stroke-width="30" stroke-dasharray="100 528"
      xlink:href="#motion_path">
      <animate attributeName="stroke-dashoffset"
        from="100" to="-528"
        begin="0s" dur="5s"
        stroke="${stroke}"
        repeatCount="indefinite" />
    </use>`
}

const rotateAll = () => {
  return `<animateTransform
  attributeName="transform"
  type="rotate"
  begin="0s"
  dur="9s"
  fill="freeze"
  from="0,200,200"
  to="360,200,200"
  repeatCount="indefinite" />`
}


async function main() {

  const cx = 200;
  const cy = 200;
  const visibleCircleRadius = 30;
  const wrapperCircleRadius = 50;
  const baseColor = "url(#linear_gradient)";

  const g = (ch?: any) => {
    return [
      "<g>",
      defs(),
      circle({
        cx,
        cy: cy - wrapperCircleRadius,
        r: visibleCircleRadius,
        fill: baseColor
      }),
      circle({
        cx,
        cy: cy + wrapperCircleRadius,
        r: visibleCircleRadius,
        fill: baseColor
      }),
      motionPath({
        x1: cx,
        y1: cy,
        rx: wrapperCircleRadius,
        ry: wrapperCircleRadius,
        xRotation: 90,
      }),
      animatedStroke({ stroke: baseColor }),
      rotateAll(),
      "</g>"].join("")
  }

  const generatedSvg = svg(g())

  await outputAsFile("eight.svg", generatedSvg)
}


main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
