import * as signalR from "@microsoft/signalr";

class Connection {
  private m_Connection : signalR.HubConnection;

  constructor() {
    this.m_Connection = new signalR.HubConnectionBuilder().withUrl('/lobby').build();
  }

  async connect() : Promise<void> {
    return new Promise((resolve, reject) => {
      this.m_Connection.start()
      .then(() => {
        resolve();
      }).catch((error) => {
        console.error(`SignaR error: ${error}`);
        reject();
      });
    });
    
  }

  registerEvent(methodName: string, newMethod: (...args: any[]) => void): void {
    this.m_Connection.on(methodName, newMethod);
  }

  unregisterEvent(methodName: string): void {
    this.m_Connection.off(methodName);
  }

  sendEvent(methodName: string, ...args: any[]): Promise<void> {
    return this.m_Connection.send(methodName, ...args);
  }
}

const SignalRConnection = new Connection();
export default SignalRConnection;