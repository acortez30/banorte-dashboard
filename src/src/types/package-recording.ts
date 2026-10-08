export interface PackageRecordingEvent {
  Id: number;
  MonitorId?: number;
  Name?: string;
  Cause?: string;
  StartDateTime?: string;
  EndDateTime?: string;
  Width?: number;
  Height?: number;
  Length?: string;
  Frames?: number;
  AlarmFrames?: number;
  DefaultVideo?: string;
  SaveJPEGs?: number;
  Videoed?: number;
  Notes?: string;
  Orientation?: string;
  DiskSpace?: number;
  StartTime?: string;
  EndTime?: string;
  FileSystemPath?: string;
}

export interface PackageRecordingMetadata {
  id_package_video: number;
  id_locker: number;
  locker_name: string;
  is_source: 0 | 1;
  camera_number: number;
  start_date: string | null;
  end_date: string | null;
}

export interface PackageRecordingItem {
  Event: PackageRecordingEvent;
  Package: PackageRecordingMetadata;
}

export interface PackageRecordingResponse {
  mensaje_return: {
    ERROR: boolean;
    ERROR_MENSAGGE: string;
    CODE: number;
  };
  recordings: {
    events: PackageRecordingItem[];
    pagination: {
      count: number;
    };
  };
}

export interface PackageRecordingGroup {
  key: string;
  idLocker: number;
  lockerName: string;
  isSource: boolean;
  events: PackageRecordingItem[];
}

export interface PackageRecordingUrlParams {
  idPackage: number | string;
  idLocker: number | string;
  eventId: number | string;
  language: string;
  download?: boolean;
}
