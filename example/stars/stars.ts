import { outputAsFile } from "../lib/file";
import { svg } from "../lib/svg";

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

const noise = (max: number) => {
  return max * Math.sin(10 * Math.random() / max);
}

const randomChoice = (items: any[]) => {
  const index = Math.floor(Math.random() * items.length)
  return items[index]
}

const generateCircle = (id: number, x: number, y: number, r: number, dur: number, maxId: number): string => {
  return `<circle cx="${x}" cy="${y}" fill-opacity="0.8" filter="url(#s44)">
    <animate
      id="animate_r_${id}"
      attributeName="r"
      begin="${id === 1 ? `0s;animate_r_${maxId}.end` : `animate_r_${id - 1}.end`}"
      dur="${dur}s"
      values="0;${r}"
      fill="freeze"/>
    <animate 
      attributeName="fill"
      begin="${id === 1 ? `0s;animate_r_${maxId}.end` : `animate_r_${id - 1}.end`}"
      dur="${dur * 10 + noise(4)}s"
      repeatCount="indefinite"
      values="orange;teal;orange"
      fill="freeze" />
   </circle>`;
}

async function main() {
  const width = 450;
  const height = 450;
  const radius = 10;
  const distToNextCenter = radius * 4;
  const circleCount = 100;
  const animationTime = 1.5;

  const generate = () => {

    const x1 = Math.floor(width / 2) + noise(10);
    const y1 = Math.floor(height / 2) + noise(10);
    let circles = generateCircle(1, x1, y1, radius, animationTime, circleCount)

    const nextRandom = (currentX: number, currentY: number, size: number) => {
      const next = [-size, 0, size]
      let dx = randomChoice(next)
      let dy = randomChoice(next.filter((i) => i !== dx))

      if (currentX + dx <= 0 || currentX + dx >= width) {
        dx = -dx;
      }
      if (currentY + dy <= 0 || currentY + dy >= height) {
        dy = -dy;
      }

      return [dx, dy]
    }

    let [x2, y2] = [x1, y1];
    for (let i = 1; i < circleCount; i++) {
      const id = i + 1;
      const [nextX, nextY] = nextRandom(x2, y2, distToNextCenter);
      x2 += nextX;
      y2 += nextY;
      circles += generateCircle(id, x2 + noise(2), y2 + noise(2), radius, animationTime, circleCount)
    }

    return circles;
  }

  // 背景
  const background = `<rect width="${width}" height="${height}" fill="black" />`;

  const circles = Array(5).fill(0).map((_, i) => generate()).join("")

  const filter = `
  <filter id="s44">
  <feGaussianBlur stdDeviation="30" />
  </filter>
  `
  const g = (ch?: any) => {
    return [
      "<g>",
      filter,
      background,
      circles,
      "</g>"
    ].join("")
  }

  const generatedSvg = svg(g())

  await outputAsFile("stars.svg", generatedSvg)
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
