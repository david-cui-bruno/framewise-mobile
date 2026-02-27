import { SupabaseClient } from "@supabase/supabase-js";

export type TelemetryEventType =
  | "play"
  | "pause"
  | "seek_forward"
  | "seek_backward"
  | "complete"
  | "quarter_reached"
  | "rewatch"
  | "skip"
  | "buffer"
  | "error";

export interface TelemetryEvent {
  patient_id: string;
  video_module_id: string;
  session_id: string;
  event_type: TelemetryEventType;
  event_data: Record<string, unknown>;
  video_timestamp_seconds: number;
  created_at: string;
}

const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 30000; // 30 seconds

class TelemetryEventQueue {
  private queue: TelemetryEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private supabase: SupabaseClient | null = null;
  private isFlushing = false;

  initialize(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.startFlushTimer();
  }

  private startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushTimer = setInterval(() => {
      this.flush();
    }, FLUSH_INTERVAL);
  }

  enqueue(event: Omit<TelemetryEvent, "created_at">) {
    this.queue.push({
      ...event,
      created_at: new Date().toISOString(),
    });

    // Auto-flush if batch size reached
    if (this.queue.length >= BATCH_SIZE) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.isFlushing || this.queue.length === 0 || !this.supabase) {
      return;
    }

    this.isFlushing = true;
    const eventsToFlush = [...this.queue];
    this.queue = [];

    try {
      const { error } = await this.supabase
        .from("video_telemetry")
        .insert(eventsToFlush);

      if (error) {
        console.error("Error flushing telemetry events:", error);
        // Re-add events to queue on failure
        this.queue = [...eventsToFlush, ...this.queue];
      }
    } catch (err) {
      console.error("Error flushing telemetry events:", err);
      // Re-add events to queue on failure
      this.queue = [...eventsToFlush, ...this.queue];
    } finally {
      this.isFlushing = false;
    }
  }

  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    // Final flush on destroy
    this.flush();
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}

// Singleton instance
export const telemetryQueue = new TelemetryEventQueue();

// Generate a unique session ID (UUID v4)
export function generateSessionId(): string {
  // Generate a proper UUID v4
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
