class LoggerService {
    private scope: string;
    private initTime: Date;
    constructor({ scope }: { scope: string }) {
      this.scope = scope;
      // initialize the logger
      this.initTime = new Date();
    }
    // actions monitoring
    log(message: string) {
      const currentTime = new Date();
      console.log(
        '  ',
        currentTime.toISOString(),
        '  ',
        this.scope +
          '(' +
          (currentTime.getTime() - this.initTime.getTime()) +
          'ms) : ',
        message
      );
    }
    // errors monitoring
    error(message: string) {
      const currentTime = new Date();
      console.error(
        '  ',
        currentTime.toISOString(),
        '  ',
        this.scope +
          '(' +
          (currentTime.getTime() - this.initTime.getTime()) +
          'ms) : ',
        message
      );
    }
  
    warn(message: string) {
      const currentTime = new Date();
      console.warn(
        '  ',
        currentTime.toISOString(),
        '  ',
        this.scope +
          '(' +
          (currentTime.getTime() - this.initTime.getTime()) +
          'ms) : ',
        message
      );
    }
  }
  
  export default LoggerService;
  