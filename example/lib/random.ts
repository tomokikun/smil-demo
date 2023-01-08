/**
 * `min`以上`max`以下の乱数を生成
 */
export const random = (min: number, max: number): number => {
  return max * Math.random() + min;
}
