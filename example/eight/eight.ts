import { outputAsFile } from "../lib/file";
import { svg } from "../lib/svg";

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
  id: string,
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
  const { id, x1, y1, rx, ry, xRotation } = props;

  /**
   * d="M ${x1},${y1}  // 円の中心の絶対座標に移動
      a ${rx},${ry} ${xRotation} 0 0 ${- 2 * rx}, 0 // pathが不連続にならないように半円を描く
      a ${rx},${ry} ${xRotation} 0 0 ${2 * rx}, 0
      a ${rx},${ry} ${xRotation} 0 0 ${- 2 * rx}, 0
      a ${rx},${ry} ${xRotation} 0 0 ${2 * rx}, 0
   */

  return `<path id="motion_path_${id}"
      d="M ${x1},${y1}
      a ${rx},${ry} ${xRotation} 0 0 0,${- 2 * ry}
      a ${rx},${ry} ${xRotation} 0 0 0,${2 * ry}
      a ${rx},${ry} ${xRotation} 0 1 0,${2 * ry}
      a ${rx},${ry} ${xRotation} 0 1 0,${- 2 * ry}"
      stroke-linecap="round"
      fill="transparent" />`
}

interface AnimatedStrokeProps {
  id: string,
  stroke: string, //  = "url(#linear_gradient)",
  strokeWidth: number,
  radius: number, // pathで描く円の半径
  circleCount: number, // pathで描く円の数
  dur: number // duration of animation [sec]
}

const animatedStroke = (props: AnimatedStrokeProps) => {
  const { id, stroke, strokeWidth, radius, circleCount, dur } = props;

  const dashLength = radius * 2;
  // 円周の長さからダッシュの長さを引く
  const dashGap = 2 * Math.PI * radius * circleCount - dashLength;

  return `<use stroke="url(#linear_gradient)" stroke-width="${strokeWidth}" stroke-dasharray="${dashLength} ${dashGap}"
      xlink:href="#motion_path_${id}">
      <animate attributeName="stroke-dashoffset"
        from="100" to="-528"
        begin="0s" dur="${dur}s"
        stroke="${stroke}"
        repeatCount="indefinite" />
    </use>`
}

interface RotateAllProps {
  cx: number,
  cy: number,
  dur: number // duration of animation [sec]
}

const rotateAll = (props: RotateAllProps) => {
  const { cx, cy, dur } = props;

  return `<animateTransform
  attributeName="transform"
  type="rotate"
  begin="0s"
  dur="${dur}s"
  fill="freeze"
  from="0,${cx},${cy}"
  to="360,${cx},${cy}"
  repeatCount="indefinite" />`
}


interface EightProps {
  id: string,
  cx: number,
  cy: number,
  visibleCircleRadius: number,
  circleCount: number,
  baseColor: string,
  strokeDuration: number,
  rotateDuration: number,
  defs: string, // <defs />
}

export const eight = (props: EightProps) => {
  const { id, cx, cy, visibleCircleRadius, circleCount, baseColor, strokeDuration, rotateDuration, defs } = props;
  const wrapperCircleRadius = visibleCircleRadius * 1.6;
  const strokeWidth = visibleCircleRadius;

  return [
    "<g>",
    defs,
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
      id,
      x1: cx,
      y1: cy,
      rx: wrapperCircleRadius,
      ry: wrapperCircleRadius,
      xRotation: 90,
    }),
    animatedStroke({
      id,
      stroke: baseColor,
      strokeWidth,
      radius: wrapperCircleRadius,
      circleCount,
      dur: strokeDuration
    }),
    rotateAll({
      cx,
      cy,
      dur: rotateDuration
    }),
    "</g>"
  ].join("");
}

async function main() {

  const cx = 200;
  const cy = 200;
  const visibleCircleRadius = 30;
  const circleCount = 2;
  const baseColor = "url(#linear_gradient)";
  const strokeDuration = 10
  const rotateDuration = 10

  const g = eight({
    id: "",
    cx,
    cy,
    visibleCircleRadius,
    circleCount,
    baseColor,
    strokeDuration,
    rotateDuration,
    defs: defs()
  })

  const generatedSvg = svg(g)

  await outputAsFile("eight.svg", generatedSvg)
}


main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
