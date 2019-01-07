export default class Utils{
  constructor(){}

  static limit(millis: number, callback: any): Promise<any>{ 
    return new Promise((res, rej) => {
      setTimeout(() => { rej('Timeout'); }, millis)
      callback(res, rej)
    })
  }
}