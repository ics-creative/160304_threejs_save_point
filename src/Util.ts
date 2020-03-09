/**
 * 便利メソッドクラスです。
 */
export class Util {
  /**
   * min, maxの間でランダムな数を返します。
   * @param {number} min
   * @param {number} max
   * @return number
   */
  public static random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
