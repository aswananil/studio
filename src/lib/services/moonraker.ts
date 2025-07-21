// A simplified TypeScript implementation inspired by the Python Moonraker client.
// This will handle WebSocket communication with the Moonraker API for Klipper.

import { z } from 'zod';

export enum ConnectionState {
  DISCONNECTED = 'Disconnected',
  CONNECTING = 'Connecting',
  CONNECTED = 'Ready',
  ERROR = 'Error',
  RECONNECTING = 'Reconnecting',
}

const KlipperStatusSchema = z.object({
  state: z.string(),
  state_message: z.string(),
});
export type KlipperStatus = z.infer<typeof KlipperStatusSchema>;

const MessageSchema = z.object({
  method: z.string().optional(),
  params: z.any().optional(),
  id: z.number().optional(),
  result: z.any().optional(),
});

type StatusCallback = (status: KlipperStatus) => void;
type ConnectionCallback = (state: ConnectionState) => void;

class MoonrakerClient {
  private ws: WebSocket | null = null;
  private messageId = 1;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 2000;

  public connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private statusCallbacks = new Set<StatusCallback>();
  private connectionCallbacks = new Set<ConnectionCallback>();

  constructor(private host: string = 'localhost', private port: number = 7125) {}

  private get wsUrl(): string {
    return `ws://${this.host}:${this.port}/websocket`;
  }

  public connect(): void {
    if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
      return;
    }
    
    this.notifyConnectionState(ConnectionState.CONNECTING);
    try {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
      this.ws.onclose = this.onClose.bind(this);
      this.ws.onerror = this.onError.bind(this);
    } catch (error) {
        console.error('WebSocket connection error:', error);
        this.notifyConnectionState(ConnectionState.ERROR);
    }
  }

  private onOpen(): void {
    this.reconnectAttempts = 0;
    this.notifyConnectionState(ConnectionState.CONNECTED);
    this.subscribeToObjects();
  }

  private onMessage(event: MessageEvent): void {
    try {
        const data = MessageSchema.parse(JSON.parse(event.data));
        if (data.method === 'notify_status_update') {
            const status = KlipperStatusSchema.parse(data.params?.[0]?.print_stats);
            this.notifyStatus(status);
        }
    } catch (error) {
        console.error('Error parsing message or status:', error);
    }
  }
  
  private onClose(): void {
    this.ws = null;
    this.notifyConnectionState(ConnectionState.DISCONNECTED);
    this.handleReconnect();
  }

  private onError(event: Event): void {
    console.error('WebSocket error:', event);
    this.notifyConnectionState(ConnectionState.ERROR);
    this.ws?.close();
  }
  
  private handleReconnect(): void {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => {
              this.notifyConnectionState(ConnectionState.RECONNECTING);
              this.connect();
          }, this.reconnectDelay * this.reconnectAttempts);
      } else {
          console.error("Max reconnection attempts reached.");
      }
  }

  private send(payload: object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  private subscribeToObjects(): void {
    this.send({
      jsonrpc: '2.0',
      method: 'printer.objects.subscribe',
      params: { objects: { print_stats: null } },
      id: this.messageId++,
    });
  }
  
  public addStatusCallback(callback: StatusCallback): void {
    this.statusCallbacks.add(callback);
  }
  
  public removeStatusCallback(callback: StatusCallback): void {
    this.statusCallbacks.delete(callback);
  }

  public addConnectionCallback(callback: ConnectionCallback): void {
    this.connectionCallbacks.add(callback);
    // Immediately notify with current state
    callback(this.connectionState);
  }

  public removeConnectionCallback(callback: ConnectionCallback): void {
    this.connectionCallbacks.delete(callback);
  }

  private notifyStatus(status: KlipperStatus): void {
    this.statusCallbacks.forEach(cb => cb(status));
  }

  private notifyConnectionState(state: ConnectionState): void {
    if(this.connectionState === state) return;
    this.connectionState = state;
    this.connectionCallbacks.forEach(cb => cb(state));
  }
}

// Singleton instance
let clientInstance: MoonrakerClient | null = null;

export function getMoonrakerClient(): MoonrakerClient {
  if (!clientInstance) {
    clientInstance = new MoonrakerClient();
    if (typeof window !== 'undefined') {
        clientInstance.connect();
    }
  }
  return clientInstance;
}
