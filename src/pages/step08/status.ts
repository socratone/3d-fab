export type EquipmentStatus = "idle" | "running" | "error";

export const statusLabels: Record<EquipmentStatus, string> = {
  idle: "대기", running: "가동", error: "오류",
};

export const statusColors: Record<EquipmentStatus, string> = {
  idle: "#f59e0b", running: "#22c55e", error: "#ef4444",
};

export const statuses: EquipmentStatus[] = ["idle", "running", "error"];
