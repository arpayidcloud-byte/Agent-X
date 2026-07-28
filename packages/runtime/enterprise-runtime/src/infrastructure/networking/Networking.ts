import { createHash } from 'crypto';

export interface GatewayRoute {
  readonly routeId: string;
  readonly path: string;
  readonly method: string;
  readonly target: string;
  readonly checksum: string;
}

export class APIGateway {
  private routes = new Map<string, GatewayRoute>();

  addRoute(path: string, method: string, target: string): GatewayRoute {
    const routeId = `route-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ routeId, path, method, target }))
      .digest('hex');
    const route: GatewayRoute = Object.freeze({ routeId, path, method, target, checksum });
    this.routes.set(routeId, route);
    return route;
  }

  removeRoute(routeId: string): boolean {
    return this.routes.delete(routeId);
  }

  getRoute(routeId: string): GatewayRoute | undefined {
    return this.routes.get(routeId);
  }

  matchRoute(path: string, method: string): GatewayRoute | undefined {
    for (const route of this.routes.values()) {
      if (route.path === path && route.method === method) return route;
    }
    return undefined;
  }

  getAll(): GatewayRoute[] {
    return Array.from(this.routes.values());
  }
}

export class RESTGateway {
  private routes = new Map<string, GatewayRoute>();

  register(path: string, handler: string): GatewayRoute {
    const routeId = `rest-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ routeId, path, handler }))
      .digest('hex');
    const route: GatewayRoute = Object.freeze({
      routeId,
      path,
      method: 'REST',
      target: handler,
      checksum,
    });
    this.routes.set(routeId, route);
    return route;
  }

  getAll(): GatewayRoute[] {
    return Array.from(this.routes.values());
  }
}

export class WebSocketGateway {
  private channels = new Map<string, Set<string>>();

  subscribe(channel: string, clientId: string): void {
    const existing = this.channels.get(channel) ?? new Set();
    existing.add(clientId);
    this.channels.set(channel, existing);
  }

  unsubscribe(channel: string, clientId: string): void {
    this.channels.get(channel)?.delete(clientId);
  }

  getClients(channel: string): string[] {
    return Array.from(this.channels.get(channel) ?? []);
  }

  getChannels(): string[] {
    return Array.from(this.channels.keys());
  }
}

export interface StreamEvent {
  readonly eventId: string;
  readonly topic: string;
  readonly data: Record<string, unknown>;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class EventStreaming {
  private streams = new Map<string, StreamEvent[]>();

  publish(topic: string, data: Record<string, unknown>): StreamEvent {
    const eventId = `ev-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ eventId, topic, data }))
      .digest('hex');
    const event: StreamEvent = Object.freeze({
      eventId,
      topic,
      data: { ...data },
      timestamp: new Date(),
      checksum,
    });
    const existing = this.streams.get(topic) ?? [];
    existing.push(event);
    this.streams.set(topic, existing);
    return event;
  }

  getEvents(topic: string): StreamEvent[] {
    return [...(this.streams.get(topic) ?? [])];
  }

  getAllTopics(): string[] {
    return Array.from(this.streams.keys());
  }
}

export interface BusMessage {
  readonly messageId: string;
  readonly type: string;
  readonly payload: Record<string, unknown>;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class InternalServiceBus {
  private handlers = new Map<string, Array<(msg: BusMessage) => void>>();
  private log: BusMessage[] = [];

  publish(type: string, payload: Record<string, unknown>): BusMessage {
    const messageId = `bus-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ messageId, type, payload }))
      .digest('hex');
    const msg: BusMessage = Object.freeze({
      messageId,
      type,
      payload: { ...payload },
      timestamp: new Date(),
      checksum,
    });
    this.log.push(msg);
    const fns = this.handlers.get(type) ?? [];
    for (const fn of fns) fn(msg);
    return msg;
  }

  subscribe(type: string, handler: (msg: BusMessage) => void): void {
    const existing = this.handlers.get(type) ?? [];
    existing.push(handler);
    this.handlers.set(type, existing);
  }

  getLog(): BusMessage[] {
    return [...this.log];
  }

  clear(): void {
    this.handlers.clear();
  }
}
