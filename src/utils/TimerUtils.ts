export class TimerUtils {
  public static sleep(seconds: number) {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve('')
      }, seconds * 1000)
    })
  }
}
