import * as signalR from "@microsoft/signalr";

class Connection {
  private m_Connection : signalR.HubConnection;

  constructor() {
    this.m_Connection = new signalR.HubConnectionBuilder().withUrl('/lobby').build();
  }

  connect() {
    this.m_Connection.start().catch(error => console.error(`SignaR error: ${error}`));
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