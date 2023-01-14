"use strict";

let circle = "";
let circle2 = "";
let animation = "";
let html = "";

let background = ' <rect width="1000" height="1000" fill="#222"></rect>';


/** 
circle = `<circle r="200" cx="500" cy="500" fill="#0589C1">\
<animateTransform \
attributeName="transform" \
type="rotate" \
from="0 500,500" \
to="360 500,500"\
dur="10s" \
repeatCount="indefinite"/></circle>`;

circle2 = `<circle r="160" cx="545" cy="500" fill="#222">\
<animateTransform \
attributeName="transform" \
type="rotate" \
from="0 500,500" \
to="360 500,500"\
dur="10s" \
repeatCount="indefinite"/></circle>`;



let xaxis = 300;
let yaxis = 450;

let dot1x = xaxis;
let dot1y = yaxis;

let dot2x = 10;
let dot2y = 30;

let dot3x = 20;
let dot3y = 40;

let dot4x = 50;
let dot4y = 70;

let dot5x = 20;
let dot5y = 70;

let dot6x = 0;
let dot6y = 0;

let dot7x = 10;
let dot7y = 30;


let pass1 = `<path id="curve" fill="blue" stroke-width="5"\
d="M ${dot1x},${dot1y} \
c ${dot7x},${dot7y} \
${dot2x},${dot2y} \
${dot3x},${dot3y} \
${dot4x},${dot4y} \
${dot5x},${dot5y} \
${dot6x},${dot6y}" >\
<animateTransform \
attributeName="transform" \
type="rotate" \
from="0 500,500" \
to="360 500,500"\
dur="8s" \
repeatCount="indefinite"/></path>`;
*/

const pos = (cx, cy, r, theta) => {
  return [cx + r * Math.cos(theta), cy + r * Math.sin(theta)]
}

/**
 * n角形の頂点座標のリストを返す
  *
  * @param {*} cx n角形の中心のx座標
  * @param {*} cy n角形の中心のy座標
  * @param {*} r 半径
  * @param {*} n 頂点数
 */
const getPoints = (cx, cy, r, n) => {
  const theta = (360 / n) * Math.PI / 180;
  return Array(n).fill(0).map((_, i) => {
    return pos(cx, cy, r, theta * i)
  })
}

/**
 * 与えられた座標の位置に点を打つ
 */
const circles = (points) => {
  return Array(n).fill(0).map((_, i) => {
    return `<circle cx="${points[i][0]}" cy="${points[i][1]}" r="3" fill="orange" />`
  }).join("")
}

const linearOutline = (points) => {
  // 始点
  let d = `M ${points[0][0]},${points[0][1]} `
  d += "L "

  // 始点より後の点を追加
  points.slice(1).forEach((p) => {
    d += `${p[0]},${p[1]} `
  })
  // pathを閉じる
  d += "Z"
  return `<path d="${d}" fill="none" stroke="lightblue" /> `
}

const noisySymmetryCurveyOutline = (points) => {
  // 始点
  let d = `M ${points[0][0]},${points[0][1]} `
  const controlX = (points[0][0] + points[1][0]) / 2 + Math.random() * 100
  const controlY = (points[0][1] + points[1][1]) / 2 + Math.random() * 100
  d += `Q ${controlX},${controlY} ${points[1][0]},${points[1][1]}  `

  // 終端を追加していく(点対称)
  points.slice(2).map((p, i) => {
    d += `T${p[0]},${p[1]} `
  })
  d += "Z"
  return `<path d="${d}" fill="none" stroke="teal" /> `
}

const noisyCurveyOutline = (points) => {
  // 始点
  let d = `M ${points[0][0]},${points[0][1]} `
  const nextQ = (i) => {
    const controlX = (points[i][0] + points[i + 1][0]) / 2 + Math.random() * 50
    const controlY = (points[i][1] + points[i + 1][1]) / 2 + Math.random() * 50
    return `Q ${controlX},${controlY} ${points[i + 1][0]},${points[i + 1][1]}  `
  }
  d += nextQ(0)

  // 終端を追加していく(点対称)
  points.slice(1).map((p, i) => {
    d += nextQ(i)
  })
  d += "Z"
  return `<path d="${d}" fill="none" stroke="orange" /> `
}

const centerPos = [300, 300]
const r = 100
const n = 14
const points = getPoints(centerPos[0], centerPos[0], r, n);

/**
const control1X = 200
const control1Y = 50
const endX = 300
const endY = 100
const control2X = 500
const control2Y = 100.99999999999994
 */

let pass2 = `
 <circle cx = "${centerPos[0]}" cy = "${centerPos[1]}" r = "3" fill = "teal" />
 <circle cx="${centerPos[0]}" cy="${centerPos[1]}" r="${r}" fill="transparent" stroke="gray" />
${circles(points)}
${linearOutline(points)}
${noisySymmetryCurveyOutline(points)}
${noisyCurveyOutline(points)}
`;

// html += background + circle + circle2 + pass1 + pass2;
html += background + pass2;

let text = document.getElementById('circle').innerHTML;
document.getElementById('circle').innerHTML += html;

console.log(html);