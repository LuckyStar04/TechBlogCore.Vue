export function parseDateTime(time: Date, useTime: boolean) {
    const date = new Date(time);
    const Y = date.getFullYear();
    const M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1);
    const D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if (!useTime) {
      return Y + '年' + M + '月' + D + '日';
    }
    return Y + '年' + M + '月' + D + '日 ' + h + ':' + m + ':' + s;
  }

  export function getNow(useTime: boolean) {
    const date = new Date();
    const Y = date.getFullYear();
    const M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1);
    const D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if (!useTime) {
      return Y + '年' + M + '月' + D + '日';
    }
    return Y + '年' + M + '月' + D + '日 ' + h + ':' + m + ':' + s;
  }