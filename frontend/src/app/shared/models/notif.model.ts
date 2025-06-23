export const NotifKind = {
    SUCCESS: "Success",
    WARNING: "Warning",
    ERROR: "Error",
} as const;
export type NotifKind = typeof NotifKind[keyof typeof NotifKind];

export type Notif = {
    kind: NotifKind,
    content: string,
};
